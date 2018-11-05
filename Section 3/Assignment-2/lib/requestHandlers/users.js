// Dependencies
const data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const validate = require('../validate');
const { verifyToken } = require('./tokens');

// Container for the users submethods
const userMethod = {};


/**
 * Users - post
 * Required data: firstName, lastName, phone, password, tosAgreement
 * Optional data: none
 */
userMethod.post = async function createNewUser(requestData) {
  // Check that all the required data are filled out correctly
  const userObject = {
    email: await validate.email(requestData.payload.email),
    firstName: await validate.firstName(requestData.payload.firstName),
    lastName: await validate.lastName(requestData.payload.lastName),
    streetAddress: await validate.streetAddress(requestData.payload.streetAddress),
    tosAgreement: await validate.tos(requestData.payload.tosAgreement),

    // Validate the password then hash it
    hashedPassword: await validate.password(requestData.payload.password)
      .then((validatedPassword) => helpers.hash(validatedPassword)),
  };

  // Store user on disc
  await data.create('users', userObject.email, userObject);

  return {
    statusCode: config.statusCode.ok,
  };
};


/**
 * Users - get
 * required data: email
 * optional data: none
 * 
 * only let an authorized user access their object,
 * dont let them access anyone elses
 */
userMethod.get = async function getUserInformation(requestData) {
  // Check that the email provided is valid
  const email = await validate.email(requestData.queryStringObject.email);

  // Get the token from the headers then validate and verify it
  const token = await validate.token(requestData.headers.token);
  await verifyToken(token, email);

  const userData = await data.read('users', email);
  delete userData.hashedPassword;

  return {
    statusCode: config.statusCode.ok,
    payload: userData,
  };
};


/**
 * Users - put
 * required data: email
 * Optional data: firstname, lastname, password (at least one must be specified)
 */
userMethod.put = async function updateUserInformation(requestData) {
  // Check that all the required data are filled out
  const { email } = requestData.payload;
  const { token } = requestData.headers;
  await validate.email(email);
  await validate.token(token);
  await verifyToken(token, email);

  // Get the users data from the server 
  const userData = await data.read('users', email);

  const { firstName, lastName, streetAddress, password } = requestData.payload;

  // First name
  if (firstName) {
    await validate.firstName(firstName);
    userData.firstName = firstName;
  }

  // Last name
  if (lastName) {
    await validate.lastName(lastName);
    userData.lastName = lastName;
  }

  // Street address
  if (streetAddress) {
    await validate.streetAddress(streetAddress);
    userData.streetAddress = streetAddress;
  }

  // Password
  if (password) {
    await validate.password(password);
    userData.hashedPassword = await helpers.hash(password);
  }

  data.update('users', email, userData);

  return {
    statusCode: config.statusCode.ok,
  };
};


/**
 * Users - delete
 * Required field: phone
 * Only let an authenticated user delete
 * 
 */
userMethod.delete = async function deleteUser(requestData) {
  // Check that the email provided is valid
  const { email } = requestData.queryStringObject;
  const { token } = requestData.headers;
  await validate.email(email);
  await validate.token(token);
  await verifyToken(token, email);

  await data.delete('users', email);
};


/**
 * Users handle
 */
const users = async function usersHandler(data) {
  const acceptableMethods = [
    'post',
    'get',
    'put',
    'delete',
  ];

  if (acceptableMethods.indexOf(data.method) > -1) {
    try {
      const response = await userMethod[data.method](data);

      return response;
    } catch (error) {
      if (error.statusCode) {
        return {
          statusCode: error.statusCode,
          payload: { Error: error.message },
        };
      }

      return {
        statusCode: config.statusCode.internalServerError,
        payload: { Error: `Unkown error: ${error.message}` },
      };
    }
  }

  return {
    statusCode: config.statusCode.methodNotAllowed,
    payload: { Error: 'Method not allowed' },
  };
};


module.exports = users;
