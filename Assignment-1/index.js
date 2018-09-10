/**
 * Base file
 */


/**
 * Dependencies
 */
// NodeJs dependencies
const url = require('url');
const http = require('http');

// Local dependencies
const config = require('./config');
const router = require('./handlers');


/**
 * Function decleration
 */
//Create the server object
const server = http.createServer((req, res) => {

    // Getting the path
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Getting the method
    const method = req.method.toLowerCase();


    // Setting up appropriate handler
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
    router[trimmedPath] : router['notFound'];

    chosenHandler((statusCode, payload) => {

        // If current status code is invalid, set it to 200
        statusCode = typeof(statusCode) == 'number' ? 
        statusCode : 200;

        // If current payload is invalid set it to empty object
        payload = typeof(payload) == 'object' ? 
        payload : {};

        // Stringify payload
        let payloadString = JSON.stringify(payload);
        

        // Assign the content type to JSON object
        res.setHeader('Content-Type', 'application/json');

        // send status code and payload to client
        res.writeHead(statusCode)
        res.end(payloadString);

        // log The requested data
        console.log('------------------- New Request ----------------------' + '\n' +
                    '- Request recieved on path: ' + trimmedPath + '\n' +
                    '- with this method: ' + method + '\n'
                    );
    });
});

/**
 * Function invocation
 */
server.listen(config.httpPort, () => {
    console.log('The server is open on port '+ config.httpPort);
});
