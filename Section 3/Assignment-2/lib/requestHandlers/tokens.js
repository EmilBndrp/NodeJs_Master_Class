// Dependencies
const data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const validate = require('../validate');


/**
 * Verify if a given token id is currently valid for a given user
 */
const verifyToken = async function verifyValidTokenForUser(tokenId, email) {
  // Lookup the token
  const tokenData = await data.read('tokens', tokenId);
  if (tokenData.email === email && tokenData.expires > Date.now()) {
    return Promise.resolve(true);
  }

  const err = Error('Missing required token in header, or token is invalid');
  err.statusCode = config.statusCode.forbidden;

  return Promise.reject(err);
};


// Container for the users submethods
const tokenMethod = {};


/**
 * Create token
 */
tokenMethod.post = async function createToken(requestData) {
  const { email, password } = requestData.payload;
  await validate.email(email);
  await validate.password(password);

  const userData = await data.read('users', email);

  // Hash the sent password and compare it to the hashed password stored in userData
  const hashedPassword = await helpers.hash(password);

  if (hashedPassword !== userData.hashedPassword) {
    const err = new Error('Password did not match the specified user\'s password');
    err.statusCode = config.statusCode.forbidden;

    return err;
  }

  // If valid create a new token with a random name. Set expiration date 1 hour in the future
  const tokenId = helpers.createRandomString(config.tokenLength);
  const oneHourInMilliseconds = 3600000;
  const expires = Date.now() + oneHourInMilliseconds;
  const tokenObject = {
    email,
    expires,
    id: tokenId,
  };

  await data.create('tokens', tokenId, tokenObject);

  return {
    statusCode: config.statusCode.ok,
    payload: tokenObject,
  };
};


/**
 * Get token
 */
tokenMethod.get = async function getTokenData(requestData) {
  const { id } = requestData.queryStringObject;
  await validate.token(id);

  const tokendata = await data.read('tokens', id);

  return {
    statusCode: config.statusCode.ok,
    payload: tokendata,
  };
};


/**
 * Update token
 */
tokenMethod.put = async function updateTokenExpiration(requestData) {
  const { id, extend } = requestData.payload;
  await validate.token(id);

  if (!extend) {
    const err = new Error('Missing required fields or fields are invalid');
    err.statusCode = config.statusCode.badRequest;

    return err;
  }

  const tokenData = await data.read('tokens', id);
  if (tokenData.expires < Date.now()) {
    const err = new Error('The token has already expired, and cannot be extended');
    err.statusCode = config.statusCode.badRequest;

    return err;
  }

  // Set the expirationdate to an hour from now
  const oneHourInMilliseconds = 3600000;

  tokenData.expires = Date.now() + oneHourInMilliseconds;
  await data.update('tokens', id, tokenData);

  return {
    statusCode: config.statusCode.ok,
  };
};


/**
 * Delete token
 */
tokenMethod.delete = async function deleteToken(requestData) {
  // Check that the id provided is valid
  const { id } = requestData.queryStringObject;

  await validate.token(id);
  await data.read('tokens', id);
  await data.delete('tokens', id);

  return {
    statusCode: config.statusCode.ok,
  };
};


// Export verifyToken seperatly
exports.verifyToken = verifyToken;


/**
 * Token handler
 */
exports.tokens = tokenMethod;
