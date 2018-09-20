/**
 * Request handlers
 */

// Dependencies
const _data = require( './data' );
const helpers = require( './helpers' );
const config = require( './config' );

// Define the handlers
const handlers = {};
const stdPhoneLength = 10;

/**
 * Users handle
 * 
 * @param {*} data test
 * @param {*} callback test
 * @returns {*} test
 */
handlers.users = function ( data, callback ) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];

    if ( acceptableMethods.indexOf( data.method ) > -1 ) {
        return handlers._users[data.method]( data, callback );
    }

    return callback( config.statusCode.methodNotAllowed );
};

// Container for the users submethods
handlers._users = {};

/**
 * Users - post
 * Required data: firstName, lastName, phone, password, tosAgreement
 * Optional data: none
 * 
 * @param {*} data firstName, lastName, phone, password, tosAgreement
 * @param {*} callback test
 * @returns {*} test
 */
handlers._users.post = function ( data, callback ) {

    // Check that all the required data are filled out
    const firstName = typeof ( data.payload.firstName ) === 'string' &&
        data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() :
        false;

    const lastName = typeof ( data.payload.lastName ) === 'string' &&
        data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() :
        false;

    const phone = typeof ( data.payload.phone ) === 'string' &&
        data.payload.phone.trim().length === stdPhoneLength ?
        data.payload.phone.trim() :
        false;

    const password = typeof ( data.payload.password ) === 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;

    const tosAgreement = typeof ( data.payload.tosAgreement ) === 'boolean' &&
        data.payload.tosAgreement === true ?
        true :
        false;

    if ( firstName && lastName && phone && password && tosAgreement ) {
        // Make sure that the user doesn't already exist
        return _data.read( 'users', phone, ( err ) => {
            if ( err ) {
                // Hash the password
                const hashedPassword = helpers.hash( password );

                // Create the user object
                if ( hashedPassword ) {
                    const userObject = {
                        'firstName': firstName,
                        'hashedPassword': hashedPassword,
                        'lastName': lastName,
                        'phone': phone,
                        'tosAgreement': true,
                    };

                    // Store user on disc
                    return _data.create( 'users', phone, userObject, ( err ) => {

                        if ( !err ) {
                            return callback( config.statusCode.ok );
                        }

                        return callback( config.statusCode.internalServerError, { 'Error': 'could not create the new user' });
                    });
                }

                return callback( config.statusCode.internalServerError, { 'Error': 'Could not hash the user\'s password' });
            }

            return callback( config.statusCode.badRequest, { 'Error': 'A User with that phone number already exists' });
        });
    }

    return callback( config.statusCode.badRequest, { 'Error': 'missing required fields' });
};


/**
 * Users - get
 * require data: phone
 * optional data: none
 * only let an authorized user access their object, dont let them access anyone elses
 * 
 * @param {*} data phone
 * @param {*} callback test
 * @return {*} test
 */
handlers._users.get = function ( data, callback ) {
    // Check that the phonenumber provided is valid
    const phone = typeof ( data.queryStringObject.phone ) === 'string' &&
        data.queryStringObject.phone.trim().length === stdPhoneLength ?
        data.queryStringObject.phone.trim() :
        false;

    if ( phone ) {
        return _data.read( 'users', phone, ( err, data ) => {
            if ( !err && data ) {
                // Remove the hashed password from the user object before returning it to the requirester
                delete data.hashedPassword;

                return callback( config.statusCode.ok, data );
            }

            return callback( config.statusCode.notFound );
        });
    }

    return callback( config.statusCode.badRequest, { 'error': 'missing required field (phone Nr)' });
};

/**
 * Users - put
 * required data: phone
 * Optional data: firstname, lastname, password (at least one must be specified)
 * 
 * @param {*} data test
 * @param {*} callback test
 * @returns {*} test
 */
handlers._users.put = function ( data, callback ) {

    const firstName = typeof ( data.payload.firstName ) === 'string' &&
        data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() :
        false;

    const lastName = typeof ( data.payload.lastName ) === 'string' &&
        data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() :
        false;

    const phone = typeof ( data.payload.phone ) === 'string' &&
        data.payload.phone.trim().length === stdPhoneLength ?
        data.payload.phone.trim() :
        false;

    const password = typeof ( data.payload.password ) === 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;

    // Error if the phone is invalid
    if ( phone ) {
        // Error if nothing is sent to update
        if ( firstName || lastName || password ) {
            return _data.read( 'users', phone, ( err, userData ) => {
                if ( !err && userData ) {
                    // Update the fileds that are neccesary
                    if ( firstName ) {
                        userData.firstName = firstName;
                    }
                    if ( lastName ) {
                        userData.lastName = lastName;
                    }
                    if ( password ) {
                        userData.hashedPassword = helpers.hash( password );
                    }

                    // Store the new updates
                    return _data.update( 'users', phone, userData, ( err ) => {
                        if ( !err ) {
                            return callback( config.statusCode.ok );
                        }

                        return callback( config.statusCode.internalServerError, { 'Error': 'Could not update the user' });
                    });
                }

                return callback( config.statusCode.badRequest, { 'Error': 'The specified user does not exist' });
            });

        }

        return callback( config.statusCode.badRequest, { 'Error': 'Missing fields to update' });
    }

    return callback( config.statusCode.badRequest, { 'Error': 'Missing required field (phone Nr. is invalid)' });
};

/**
 * Users - delete
 * Required field: phone
 * Only let an authenticated user delete
 * 
 * @param {*} data test
 * @param {*} callback test
 * @returns {*} test
 */
handlers._users.delete = function ( data, callback ) {
    // Check that the phonenumber provided is valid
    const phone = typeof ( data.queryStringObject.phone ) === 'string' &&
        data.queryStringObject.phone.trim().length === stdPhoneLength ?
        data.queryStringObject.phone.trim() :
        false;

    if ( phone ) {
        return _data.read( 'users', phone, ( err, data ) => {
            if ( !err && data ) {
                return _data.delete( 'users', phone, ( err ) => {
                    if ( !err ) {
                        return callback( config.statusCode.ok );
                    }

                    return callback( config.statusCode.internalServerError, { 'Error': 'Could not delete the specified user' });
                });
            }

            return callback( config.statusCode.badRequest, { 'Error': 'Could not find the specified user' });
        });
    }

    return callback( config.statusCode.badRequest, { 'error': 'missing required field (phone Nr)' });
};


// Ping handler
handlers.ping = function ( data, callback ) {
    callback( config.statusCode.ok );
};


// Not found handler
handlers.notFound = function ( data, callback ) {
    callback( config.statusCode.notFound );
};

module.exports = handlers;
