/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');


// Container for all the helpers
const helpers = {};


// Create a SHA256 hash from string
helpers.hash = function hashString(str) {
  if (typeof (str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');

    return hash;
  }

  return false;
};


// Parse a JSON string to an object in all cases, without throwing an error
helpers.parseJsonToObject = function parseAlwaysJsonToObject(str) {
  try {
    const obj = JSON.parse(str);

    return obj;
  } catch (err) {
    return {};
  }
};


helpers.createRandomString = function createARandomString(stringLength) {
  const strLength = typeof (stringLength) === 'number'
    && stringLength > 0
    ? stringLength
    : false;

  if (strLength) {
    // Make an array with the length of the string
    return [...Array(strLength)]

    // Assign a random character to each index in the array
      .map(() => Math.random()
        .toString(36)
        .substring(2, 3))

    // Join the array to a string
      .join('');
  }

  return false;
};


module.exports = helpers;
