const config = require('../config');

// Not found handler
const notFound = function notFoundHandler() {
  return { statusCode: config.statusCode.notFound };
};

module.exports = notFound;
