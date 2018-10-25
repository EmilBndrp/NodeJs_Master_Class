// Dependencies
const data = require('../data');
const helpers = require('../helpers');
const config = require('../config');


// Container for the users submethods
const tokenMethod = {};

tokenMethod.post = async function createToken(requestData) {
  const email = typeof (requestData.payload.email) === 'string'
    && requestData.payload.email.trim().length > 0
    ? requestData.payload.email.trim()
    : false;

  const password = typeof (requestData.payload.password) === 'string'
    && requestData.payload.password.trim().length > 0
    ? requestData.payload.password.trim()
    : false;

  if (!(email && password)) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'Missing erquired fields' },
    };
  }

  try {
    const userData = await data.read('users', email);

    // Hash the sent password and compare is to the hashed password stored in userData
    const hashedPassword = await helpers.hash(password);

    if (hashedPassword !== userData.hashedPassword) {
      return {
        statusCode: config.statusCode.forbidden,
        payload: { Error: 'Password did not match the specified user\'s password' },
      };
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
  } catch (error) {
    return {};
  }
};

tokenMethod.get = async function getTokenData(requestData) {
  const id = typeof (requestData.queryStringObject.id) === 'string'
        && requestData.queryStringObject.id.trim().length === config.tokenLength
    ? requestData.queryStringObject.id.trim()
    : false;

  if (!id) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'missing required field (id)' },
    };
  }

  try {
    const tokendata = await data.read('tokens', id);

    return {
      statusCode: config.statusCode.ok,
      payload: tokendata,
    };
  } catch (error) {
    return {
      statusCode: config.statusCode.notFound,
    };
  }
};

tokenMethod.put = async function updateTokenExpiration(requestData) {
  const id = typeof (requestData.payload.id) === 'string'
    && requestData.payload.id.trim().length > 0
    ? requestData.payload.id.trim()
    : false;

  const extend = typeof (requestData.payload.extend) === 'boolean'
    && requestData.payload.extend === true
    ? true
    : false;

  if (!id || !extend) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'Missing required fields or fields are invalid' },
    };
  }

  try {
    const tokenData = await data.read('tokens', id);

    if (tokenData.expires > Date.now()) {
      // Set the expirationdate to an hour from now
      const oneHourInMilliseconds = 3600000;
                    
      tokenData.expires = Date.now() + oneHourInMilliseconds;
      await data.update('tokens', id, tokenData);

      return {
        statusCode: config.statusCode.ok,
      };
    }

    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'The token has already expired, and cannot be extended' },
    };
  } catch (error) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: `error: ${error}` },
    };
  }
};

tokenMethod.delete = async function deleteToken(requestData) {
  // Check that the id provided is valid
  const id = typeof (requestData.queryStringObject.id) === 'string'
    && requestData.queryStringObject.id.trim().length === config.tokenLength
    ? requestData.queryStringObject.id.trim()
    : false;

  if (!id) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: 'missing required field (token id)' },
    };
  }

  try {
    await data.read('tokens', id);
    await data.delete('tokens', id);

    return {
      statusCode: config.statusCode.ok,
    };
  } catch (error) {
    return {
      statusCode: config.statusCode.badRequest,
      payload: { Error: `error: ${error}` },
    };
  }
};

// Verify if a given token id is currently valid for a given user
exports.verifyToken = async function verifyValidTokenForUser(tokenId, email) {
  try {
    // Lookup the token
    const tokenData = await data.read('tokens', tokenId);

    if (tokenData.email === email && tokenData.expires > Date.now()) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

// Token handler
exports.tokens = function tokenHandler(data) {
  const acceptableMethods = [
    'post',
    'get',
    'put',
    'delete',
  ];

  if (acceptableMethods.indexOf(data.method) > -1) {
    return tokenMethod[data.method](data);
  }

  return {
    statusCode: config.statusCode.methodNotAllowed,
    payload: { Error: 'Method not allowed' },
  };
};
