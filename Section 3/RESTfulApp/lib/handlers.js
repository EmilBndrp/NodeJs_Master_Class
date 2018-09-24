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
const tokenLength = 20;

/**
 * Users handle
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
 */
handlers._users.get = function ( data, callback ) {
    // Check that the phonenumber provided is valid
    const phone = typeof ( data.queryStringObject.phone ) === 'string' &&
        data.queryStringObject.phone.trim().length === stdPhoneLength ?
        data.queryStringObject.phone.trim() :
        false;


    if ( phone ) {
        // Get the token from the headers
        const token = typeof ( data.headers.token ) === 'string' ?
            data.headers.token :
            false;
        
        // Verify that the given token is valid for the phone number
        return handlers._tokens.verifyToken( token, phone, ( tokenIsValid ) => {
            if ( tokenIsValid ) {
                return _data.read( 'users', phone, ( err, data ) => {
                    if ( !err && data ) {
                        // Remove the hashed password from the user object before returning it to the requirester
                        delete data.hashedPassword;
        
                        return callback( config.statusCode.ok, data );
                    }
        
                    return callback( config.statusCode.notFound );
                });
            }

            return callback( config.statusCode.forbidden, { 'Error': 'Missing required token in header, or token is invalid' });
        });
    }

    return callback( config.statusCode.badRequest, { 'error': 'missing required field (phone Nr)' });
};

/**
 * Users - put
 * required data: phone
 * Optional data: firstname, lastname, password (at least one must be specified)
 * 
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

            // Get the token from the headers
            const token = typeof ( data.headers.token ) === 'string' ?
                data.headers.token :
                false;

            // Verify that the given token is valid for the phone number
            return handlers._tokens.verifyToken( token, phone, ( tokenIsValid ) => {
                if ( tokenIsValid ) {
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

                return callback( config.statusCode.forbidden, { 'Error': 'Missing required token in header, or token is invalid' });
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
 */
handlers._users.delete = function ( data, callback ) {
    // Check that the phonenumber provided is valid
    const phone = typeof ( data.queryStringObject.phone ) === 'string' &&
        data.queryStringObject.phone.trim().length === stdPhoneLength ?
        data.queryStringObject.phone.trim() :
        false;

    if ( phone ) {
        // Get the token from the headers
        const token = typeof ( data.headers.token ) === 'string' ?
            data.headers.token :
            false;
        
        // Verify that the given token is valid for the phone number
        return handlers._tokens.verifyToken( token, phone, ( tokenIsValid ) => {
            if ( tokenIsValid ) {
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

            return callback( config.statusCode.forbidden, { 'Error': 'Missing required token in header, or token is invalid' });
        });
    }

    return callback( config.statusCode.badRequest, { 'error': 'missing required field (phone Nr)' });
};


/**
 * Users handle
 * 
 */
handlers.tokens = function ( data, callback ) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];

    if ( acceptableMethods.indexOf( data.method ) > -1 ) {
        return handlers._tokens[data.method]( data, callback );
    }

    return callback( config.statusCode.methodNotAllowed );
};

// Container for all tokens methods
handlers._tokens = {};

/**
 * Tokens - post
 * Required data: phone, password
 * Optional data: none
 * 
 */
handlers._tokens.post = function ( data, callback ) {
    const phone = typeof ( data.payload.phone ) === 'string' &&
        data.payload.phone.trim().length === stdPhoneLength ?
        data.payload.phone.trim() :
        false;

    const password = typeof ( data.payload.password ) === 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;

    if ( phone && password ) {
        // Lookup user who matches phone number
        return _data.read( 'users', phone, ( err, userData ) => {
            if ( !err && userData ) {
                // Hash the sent password and compare is to the hashed password stored in userData
                const hashedPassword = helpers.hash( password );

                if ( hashedPassword === userData.hashedPassword ) {
                    // If valid create a new token with a random name. Set expiration date 1 hour in the future
                    const tokenId = helpers.createRandomString( tokenLength );
                    const expires = Date.now() + ( 1000 * 60 * 60 );
                    const tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires,
                    };

                    // Store the token
                    return _data.create( 'tokens', tokenId, tokenObject, ( err ) => {
                        if ( !err ) {
                            return callback( config.statusCode.ok, tokenObject );
                        }

                        return callback( config.statusCode.internalServerError, { 'Error': 'could not create the new token' });
                    });
                }

                return callback( config.statusCode.badRequest, { 'Error': 'Password did not match the specified user\'s password' });
            }

            return callback( config.statusCode.badRequest, { 'Error': 'Could not find specified user' });
        });
    }

    return callback( config.statusCode.badRequest, { 'Error': 'Missing required fields' });
};

/**
 * Tokens - get
 * Required data: id
 * Optional data: none
 * 
 */
handlers._tokens.get = function ( data, callback ) {
    const id = typeof ( data.queryStringObject.id ) === 'string' &&
        data.queryStringObject.id.trim().length === tokenLength ?
        data.queryStringObject.id.trim() :
        false;
    
    if ( id ) {
        return _data.read( 'tokens', id, ( err, tokenData ) => {
            if ( !err && tokenData ) {
                return callback( config.statusCode.ok, tokenData );
            }

            return callback( config.statusCode.notFound );
        });
    }

    return callback( config.statusCode.badRequest, { 'error': 'missing required field (id)' });
};

/**
 * Tokens - put
 * Required: id: extend
 * Optional data: none
 * 
 */
handlers._tokens.put = function ( data, callback ) {
    const id = typeof ( data.payload.id ) === 'string' &&
        data.payload.id.trim().length > 0 ?
        data.payload.id.trim() :
        false;

    const extend = typeof ( data.payload.extend ) === 'boolean' &&
        data.payload.extend === true ?
        true :
        false;

    if ( id && extend ) {
        // Lookup token
        return _data.read( 'tokens', id, ( err, tokenData ) => {
            if ( !err && tokenData ) {

                // Check to make sure the token isn't already expired
                if ( tokenData.expires > Date.now()) {
                    // Set the expirationdate to an hour from now
                    tokenData.expires = Date.now() + ( 1000 * 60 * 60 );

                    // Store the new updates
                    return _data.update( 'tokens', id, tokenData, ( err ) => {
                        if ( !err ) {
                            return callback( config.statusCode.ok );
                        }

                        return callback( config.statusCode.internalServerError, { 'Error': 'Could not update token\'s expiration' });
                    });
                }

                return callback( config.statusCode.badRequest, { 'Error': 'The token has already expired, and cannot be extended' });
            }

            return callback( config.statusCode.badRequest, { 'Error': 'Specified token does not exist' });
        });
    }

    return callback( config.statusCode.badRequest, { 'Error:': 'Missing required fields or fields are invalid' });
};

// Tokens - delete
/**
 * Tokens - delete
 * Required data: id
 * optional data: none
 * 
 */
handlers._tokens.delete = function ( data, callback ) {
    // Check that the id provided is valid
    const id = typeof ( data.queryStringObject.id ) === 'string' &&
        data.queryStringObject.id.trim().length === tokenLength ?
        data.queryStringObject.id.trim() :
        false;

    if ( id ) {
        return _data.read( 'tokens', id, ( err, data ) => {
            if ( !err && data ) {
                return _data.delete( 'tokens', id, ( err ) => {
                    if ( !err ) {
                        return callback( config.statusCode.ok );
                    }

                    return callback( config.statusCode.internalServerError, { 'Error': 'Could not delete the specified token' });
                });
            }

            return callback( config.statusCode.badRequest, { 'Error': 'Could not find the specified token' });
        });
    }

    return callback( config.statusCode.badRequest, { 'error': 'missing required field (token id)' });
};


/**
 * Verify if a given token id is currently valid for a given user
 */
handlers._tokens.verifyToken = function ( id, phone, callback ) {
    // Lookup the token
    _data.read( 'tokens', id, ( err, tokenData ) => {
        if ( !err && tokenData ) {
            // Check that the token is for the given user and has not expired
            if ( tokenData.phone == phone && tokenData.expires > Date.now()) {
                return callback( true );
            }

            return callback( false );
        }

        return callback( false );
    });
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
