const config = require('../config');

// Not found handler
const notFound = function notFoundHandler(data, callback) {
  callback(config.statusCode.notFound);
};

module.exports = notFound;
