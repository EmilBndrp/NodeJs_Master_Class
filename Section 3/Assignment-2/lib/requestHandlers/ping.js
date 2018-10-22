const config = require('../config');

// Ping handler
const ping = function pingHandler(data, callback) {
  return callback(config.statusCode.ok);
};

module.exports = ping;
