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
  const { email, firstName, lastName, streetAddress, tosAgreement, password } = requestData.payload;

  // Check that all the required data are filled out correctly
  const userObject = {
    email: await validate.email(email),
    firstName: await validate.firstName(firstName),
    lastName: await validate.lastName(lastName),
    streetAddress: await validate.streetAddress(streetAddress),
    tosAgreement: await validate.tos(tosAgreement),

    // Validate the password then hash it
    hashedPassword: await validate.password(password)
      .then((validatedPassword) => helpers.hash(validatedPassword)),

    cart: {},
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
  // Check that all the required data are filled out
  const { email } = requestData.queryStringObject;
  const { token } = requestData.headers;
  await validate.email(email);
  await validate.token(token);
  await verifyToken(token, email);

  const userData = await data.read('users', email);
  delete userData.hashedPassword;
  delete userData.cart;

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

  return {
    statusCode: config.statusCode.ok,
  };
};


module.exports = userMethod;
