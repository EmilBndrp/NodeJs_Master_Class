const data = require('../data');
const config = require('../config');
const validate = require('../validate');
const { verifyToken } = require('./tokens');

/**
 * @param {Object} requestData
 * @return {Object}
 */
const menuMethod = {};

menuMethod.get = async function getMenu(requestData) {
  // Check that the email provided is valid
  const email = await validate.email(requestData.queryStringObject.email);

  // Get the token from the headers then validate and verify it
  const token = await validate.token(requestData.headers.token);
  await verifyToken(token, email);

  const menudata = await data.read('menu', 'menu-21-11-2018');

  return {
    statusCode: config.statusCode.ok,
    payload: menudata,
  };
};

/**
 * Users handle
 */
const menu = async function usersHandler(data) {
  const acceptableMethods = ['get'];

  if (acceptableMethods.indexOf(data.method) > -1) {
    try {
      const response = await menuMethod[data.method](data);

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

module.exports = menu;
