/**
 * Primary file for the API
 */

// Dependendies
const server = require('./lib/server');
const workers = require('./lib/workers');

// Declare the app
const app = {};

// Init function
app.init = function initiation() {
  // Start the server
  server.init();

  // Start the workers
  workers.init();
};

// Export the app
module.exports = app;

// Execute the app
app.init();
