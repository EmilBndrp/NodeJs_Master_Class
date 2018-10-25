const config = require('../config');

// Ping handler
const ping = function pingHandler() {
  return { statusCode: config.statusCode.ok };
};

module.exports = ping;
