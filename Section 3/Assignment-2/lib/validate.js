const config = require('./config');
const validate = {};


/**
 * Validate email
 */
validate.email = function validateEmailAddress(email) {
  return new Promise((resolve, reject) => {
    if (
      typeof (email) === 'string'
      && email.trim().length > 0
      && email.trim().includes('@')
      && email.trim().includes('.')
    ) {
      return resolve(email.trim());
    }

    const err = Error('invalid email');
    err.statusCode = config.statusCode.badRequest;

    return reject(err);
  });
};


/**
 * Validate terms of service
 */
validate.tos = function validateTermsOfService(tos) {
  return new Promise((resolve, reject) => {
    if (
      typeof (tos) === 'boolean'
      && tos === true
    ) {
      return resolve(tos);
    }

    const err = Error('Terms of service is not agreed to');
    err.statusCode = config.statusCode.badRequest;

    return reject(err);
  });
};


/**
 * Validate token
 */
validate.token = function validateToken(token) {
  return new Promise((resolve, reject) => {
    if (
      typeof (token) === 'string'
      && token.trim().length === config.tokenLength
    ) {
      return resolve(token.trim());
    }

    const err = Error('invalid token');
    err.statusCode = config.statusCode.badRequest;

    return reject(err);
  });
};


/**
 * Validate string
 */
validate.string = function validateString(string, propertyName = 'String') {
  return new Promise((resolve, reject) => {
    if (
      typeof (string) === 'string'
      && string.trim().length > 0
    ) {
      return resolve(string.trim());
    }

    const err = Error(`invalid ${propertyName}`);
    err.statusCode = config.statusCode.badRequest;

    return reject(err);
  });
};


/**
 * Validate handler
 */
const handler = {
  get(target, propertyName) {
    if (propertyName in target) {
      return target[propertyName];
    }

    return function validateDataAsString(string) {
      return target.string(string, propertyName);
    };
  },
};

module.exports = new Proxy(validate, handler);
