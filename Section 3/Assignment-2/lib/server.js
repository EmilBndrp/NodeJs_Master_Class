/**
 * Server-related tasks
 */

// Dependencies
const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
const util = require('util');
const https = require('https');
const debug = util.debuglog('server');
const { StringDecoder } = require('string_decoder');

// Local files
const config = require('./config');
const helpers = require('./helpers');
const router = require('./requestHandlers');


// Instantiate the server module object
const server = {};


// Unified server
server.unifiedServer = function unifiedServerObject(req, res) {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path and remove any '/' from the start and end of the string using regex
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the http Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const { headers } = req;


  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Choose handler this request should go to. If one is not found, use the 'not found handler'
    const chosenHandler = typeof router[trimmedPath] !== 'undefined'
      ? router[trimmedPath]
      : router.notFound;

    // Construct the data object to send to the handler
    const data = {
      headers,
      method,
      queryStringObject,
      trimmedPath,
      payload: helpers.parseJsonToObject(buffer),
    };


    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the statuscode defined by the handler or default to 200
      const statusCodeToReturn = typeof (statusCode) === 'number'
        ? statusCode
        : config.statusCode.ok;

      // Use the payload called by the handler or default to an empty object
      const payloadToReturn = typeof (payload) === 'object'
        ? payload
        : {};

      // Convert to a string
      const payloadString = JSON.stringify(payloadToReturn);

      // Return response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCodeToReturn);
      res.end(payloadString);

      /**
       * Log The requested data
       * If the response is 200, print green otherwise print red
       */
      const debugMessage = '------------------- New Request ---------------------- \n'
        + `- with this method: ${method.toUpperCase()}\n`
        + `- Request recieved on path: ${trimmedPath}\n`
        + `- with these query string parameters: ${JSON.stringify(queryStringObject)}\n`
        + `- Request recieved with these headers ${JSON.stringify(headers)}\n`
        + `- Request recieved with this payload: ${buffer}\n`;

      if (statusCode === config.statusCode.ok) {
        debug('\x1b[32m%s\x1b[0m', debugMessage);
      } else {
        debug('\x1b[31m%s\x1b[0m', debugMessage);
      }
    });
  });
};

// Create the  http server object
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});


// Create the  https server object
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
  server.unifiedServer(req, res);
});


// Init function
server.init = function initializeServer() {
  // Start the http server
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', `The http server is listening on port: ${config.httpPort} in ${config.envName} mode`);
  });


  // Start the https server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[35m%s\x1b[0m', `The https server is listening on port ${config.httpsPort} in ${config.envName} mode`);
  });
};


// Export the module
module.exports = server;
