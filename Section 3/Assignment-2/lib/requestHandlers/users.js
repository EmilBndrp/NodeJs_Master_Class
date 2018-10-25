/* eslint "max-lines-per-function": 0 */

// Dependencies
const data = require('../data');
const helpers = require('../helpers');
const config = require('../config');


// Container for the users submethods
const userMethod = {};

/**
 * Users - post
 * Required data: firstName, lastName, phone, password, tosAgreement
 * Optional data: none
 */
userMethod.post = async function createNewUser(requestData) {
  // Check that all the required data are filled out
  const firstName = typeof (requestData.payload.firstName) === 'string'
    && requestData.payload.firstName.trim().length > 0
    ? requestData.payload.firstName.trim()
    : false;

  const lastName = typeof (requestData.payload.lastName) === 'string'
    && requestData.payload.lastName.trim().length > 0
    ? requestData.payload.lastName.trim()
    : false;

  const emailAddress = typeof (requestData.payload.emailAddress) === 'string'
    && requestData.payload.emailAddress.trim().length > 0
    && requestData.payload.emailAddress.trim().includes('@')
    && requestData.payload.emailAddress.trim().includes('.')
    ? requestData.payload.emailAddress.trim()
    : false;

  const streetAddress = typeof (requestData.payload.streetAddress) === 'string'
    && requestData.payload.streetAddress.trim().length > 0
    ? requestData.payload.streetAddress.trim()
    : false;

  const password = typeof (requestData.payload.password) === 'string'
    && requestData.payload.password.trim().length > 0
    ? requestData.payload.password.trim()
    : false;

  const tosAgreement = typeof (requestData.payload.tosAgreement) === 'boolean'
    && requestData.payload.tosAgreement === true
    ? true
    : false;

  if (!firstName || !lastName || !emailAddress || !streetAddress || !password || !tosAgreement) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'missing required fields' },
    };
  }

  // Make sure that the user doesn't already exist
  try {
    await data.read('users', emailAddress);

    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'User already exists' },
    };
  } catch (err) {
    // Hash the password
    const hashedPassword = await helpers.hash(password);
    const userObject = {
      firstName,
      lastName,
      emailAddress,
      streetAddress,
      hashedPassword,
      tosAgreement,
    };

    // Store user on disc
    await data.create('users', emailAddress, userObject);

    return Promise.resolve();
  }
};

/**
 * Users - get
 * require data: phone
 * optional data: none
 * only let an authorized user access their object, dont let them access anyone elses
 * 
 */
userMethod.get = async function getUserInformation(requestData) {
  // Check that the email provided is valid
  const email = typeof (requestData.queryStringObject.email) === 'string'
    && requestData.queryStringObject.email.trim().length > 0
    ? requestData.queryStringObject.email.trim()
    : false;

  if (!email) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'missing required fields email' },
    };
  }

  // Get the token from the headers
  const token = typeof (requestData.headers.token) === 'string'
    ? requestData.headers.token
    : false;

  /*const tokenIsValid = tokenMethod.verifyToken(token, email);
  if (!tokenIsValid) {
    return {
      statusCode: config.statusCode.forbidden,
      payload: { Error: 'Missing required token in header, or token is invalid' },
    };
  }*/

  try {
    const userData = await data.read('users', email);
    delete userData.hashedPassword;

    return {
      statusCode: config.statusCode.ok,
      payload: userData,
    };
  } catch (error) {
    return { statusCode: config.statusCode.notFound };
  }
};

/**
 * Users - put
 * required data: phone
 * Optional data: firstname, lastname, password (at least one must be specified)
 * 
 */
userMethod.put = async function updateUserInformation(requestData) {
  // Check that all the required data are filled out
  const firstName = typeof (requestData.payload.firstName) === 'string'
    && requestData.payload.firstName.trim().length > 0
    ? requestData.payload.firstName.trim()
    : false;

  const lastName = typeof (requestData.payload.lastName) === 'string'
    && requestData.payload.lastName.trim().length > 0
    ? requestData.payload.lastName.trim()
    : false;

  const email = typeof (requestData.payload.emailAddress) === 'string'
    && requestData.payload.emailAddress.trim().length > 0
    && requestData.payload.emailAddress.trim().includes('@')
    && requestData.payload.emailAddress.trim().includes('.')
    ? requestData.payload.emailAddress.trim()
    : false;

  const streetAddress = typeof (requestData.payload.streetAddress) === 'string'
    && requestData.payload.streetAddress.trim().length > 0
    ? requestData.payload.streetAddress.trim()
    : false;

  const password = typeof (requestData.payload.password) === 'string'
    && requestData.payload.password.trim().length > 0
    ? requestData.payload.password.trim()
    : false;

  if (!email) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'Missing required field email' },
    };
  }

  if (!(firstName || lastName || streetAddress || password)) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'Missing fields to update' },
    };
  }

  // Get the token from the headers
  const token = typeof (requestData.headers.token) === 'string'
    ? requestData.headers.token
    : false;

  /*const tokenIsValid = tokenMethod.verifyToken(token, email);
  if (!tokenIsValid) {
    return {
      statusCode: config.statusCode.forbidden,
      payload: { Error: 'Missing required token in header, or token is invalid' },
    };
  }*/

  try {
    const userData = await data.read('users', email);

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

    await data.update('users', email, userData);

    return { statusCode: config.statusCode.ok };
  } catch (error) {
    return { statusCode: config.statusCode.notFound };
  }
};

/**
 * Users - delete
 * Required field: phone
 * Only let an authenticated user delete
 * 
 */
userMethod.delete = async function deleteUser(requestData) {
  // Check that the email provided is valid
  const email = typeof (requestData.queryStringObject.email) === 'string'
    && requestData.queryStringObject.email.trim().length > 0
    ? requestData.queryStringObject.email.trim()
    : false;

  if (!email) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'missing required field (email)' },
    };
  }

  // Get the token from the headers
  const token = typeof (requestData.headers.token) === 'string'
    ? requestData.headers.token
    : false;

  /*const tokenIsValid = tokenMethod.verifyToken(token, email);
  if (!tokenIsValid) {
    return {
      statusCode: config.statusCode.forbidden,
      payload: { Error: 'Missing required token in header, or token is invalid' },
    };
  }*/

  try {
    await data.read('users', email);
    await data.delete('users', email);

    return { statusCode: config.statusCode.ok };
  } catch (error) {
    return {
      statusCode: config.statusCode.notFound,
    };
  }
};

/**
 * Users handle
 */
const users = function usersHandler(data) {
  const acceptableMethods = [
    'post',
    'get',
    'put',
    'delete',
  ];

  if (acceptableMethods.indexOf(data.method) > -1) {
    return userMethod[data.method](data);
  }

  return {
    statusCode: config.statusCode.methodNotAllowed,
    payload: { Error: 'Method not allowed' },
  };
};

module.exports = users;
