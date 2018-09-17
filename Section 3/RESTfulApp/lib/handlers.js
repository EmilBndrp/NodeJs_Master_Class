/**
 * request handlers
 */

//Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
let handlers = {};

// Users handle
handlers.users = function(data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete']
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405)
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {

    //check that all the required data are filled out
    const firstName = typeof(data.payload.firstName) == 'string' && 
        data.payload.firstName.trim().length > 0 ? 
        data.payload.firstName.trim() : false;

    const lastName = typeof(data.payload.lastName) == 'string' && 
        data.payload.lastName.trim().length > 0 ? 
        data.payload.lastName.trim() : false;

    const phone = typeof(data.payload.phone) == 'string' && 
        data.payload.phone.trim().length == 10 ? 
        data.payload.phone.trim() : false;

    const password = typeof(data.payload.password) == 'string' && 
        data.payload.password.trim().length > 0 ? 
        data.payload.password.trim() : false;

    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && 
        data.payload.tosAgreement == true ? 
        true : false;

        
    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, (err, data) => {
            if(err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);

                //create the user object
                if(hashedPassword) {
                    const userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true,
                    }
                

                // store user on disc
                _data.create('users', phone, userObject, (err) => {
                    if(!err) {
                        callback(200)
                    } else {
                        console.log(err);
                        callback(500, {'Error': 'could not create the new user'});
                    }
                });
                } else {
                    callback(500, {'Error': 'Could not hash the user\'s password'});
                }
            } else {
                callback(400, {'Error': 'A User with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error': 'missing required fields'});
    }
};

// Users - get
//require data: phone
//optional data: none
//only let an authorized user access their object, dont let them access anyone elses
handlers._users.get = function(data, callback) {
    // Check that the phonenumber provided is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' &&
        data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() : false;
    
    if (phone) {
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                // Remove the hashed password from the user object before returning it to the requirester
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404)
            }
        });
    } else {
        callback(400, { 'error': 'missing required field (phone Nr)'});
    }
};

// Users - put
// required data: phone
// Optional data: firstname, lastname, password (at least one must be specified)
handlers._users.put = function(data, callback) {
    
    const firstName = typeof(data.payload.firstName) == 'string' && 
        data.payload.firstName.trim().length > 0 ? 
        data.payload.firstName.trim() : false;

    const lastName = typeof(data.payload.lastName) == 'string' && 
        data.payload.lastName.trim().length > 0 ? 
        data.payload.lastName.trim() : false;

    const phone = typeof(data.payload.phone) == 'string' && 
        data.payload.phone.trim().length == 10 ? 
        data.payload.phone.trim() : false;

    const password = typeof(data.payload.password) == 'string' && 
        data.payload.password.trim().length > 0 ? 
        data.payload.password.trim() : false;

    //Error if the phone is invalid
    if (phone) {
        //Error if nothing is sent to update
        if ( firstName || lastName || password ) {
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update the fileds that are neccesary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }

                    // Store the new updates
                    _data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'Could not update the user'});
                        }
                    })
                } else {
                    callback(400, { 'Error': 'The specified user does not exist'});
                }
            })

        } else {
            callback(400, { 'Error': 'Missing fields to update'});
        }
    } else {
        callback(400, { 'Error': 'Missing required field (phone Nr. is invalid)'});
    }
};

// Users - delete
// Required field: phone
// Only let an authenticated user delete
handlers._users.delete = function(data, callback) {
    // Check that the phonenumber provided is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' &&
        data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() : false;
    
    if (phone) {
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                _data.delete('users', phone, (err) => {
                    if(!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the specified user'});
                    }
                });
            } else {
                callback(400, { 'Error': 'Could not find the specified user'});
            }
        });
    } else {
        callback(400, { 'error': 'missing required field (phone Nr)'});
    }

};


// Ping handler
handlers.ping = function(data, callback) {
    callback(200);
};


// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

module.exports = handlers;