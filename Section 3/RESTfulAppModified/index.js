/**
 * Primary file for the API
 */


/** 
 * NodeJs dependencies
 * The following dependencies are NodeJS built-in packages.
 * The http module provides utilities for generating and operating servers.
 * The url module provides utilities for URL resolution and parsing.
 * The string_decoder module provides an API for decoding Buffer objects into strings
 *  It does so in a manner that preserves encoded multi-byte UTF-8 and UTF-16 characters.
 *  Since stringdecoder is used as a constructor it has to be encapsulated in an object.
 * 
 * The config dependency is a seperate module provided in this project
 * 
 */
const fs = require( 'fs' );
const url = require( 'url' );
const http = require( 'http' );
const https = require( 'https' );
const { StringDecoder } = require( 'string_decoder' );

// Local files
const config = require( './lib/config' );
const handlers = require( './lib/handlers' );
const helpers = require( './lib/helpers' );

// Define a request router
const router = {
    'ping': handlers.ping,
    'tokens': handlers.tokens,
    'users': handlers.users,
    'checks': handlers.checks,
};

/**
 * All the server logic for both http and https server
 * 
 * Notes:
 * The server should respond to all requests with a string
 *  This is done within a callback function
 *      This function will be added to the request event in the server object
 *  This function contaions two variables
 *      the request object called "req"
 *          req is the request message recieved by the client
 *      The response object called "res"
 *          res is the respond the server sends to the client
 *          All requests should end with calling the res.end method
 *              Else the client will keep waiting for more information
 * 
 */
const unifiedServer = function ( req, res ) {

    // Get the URL and parse it
    const parsedUrl = url.parse( req.url, true );

    // Get the path and remove any '/' from the start and end of the string using regex
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace( /^\/+|\/+$/g, '' );

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the http Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder( 'utf-8' );
    let buffer = '';

    req.on( 'data', ( data ) => {
        buffer += decoder.write( data );
    });

    req.on( 'end', () => {
        buffer += decoder.end();

        // Choose handler this request should go to. If one is not found, use the 'not found handler'
        const chosenHandler = typeof router[trimmedPath] !== 'undefined' ?
            router[trimmedPath] :
            handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            'headers': headers,
            'method': method,
            'payload': helpers.parseJsonToObject( buffer ),
            'queryStringObject': queryStringObject,
            'trimmedPath': trimmedPath,
        };

        // Route the request to the handler specified in the router
        chosenHandler( data, ( statusCode, payload ) => {
            // Use the statuscode defined by the handler or default to 200
            statusCode = typeof ( statusCode ) === 'number' ?
                statusCode :
                config.statusCode.ok;

            // Use the payload called by the handler or default to an empty object
            payload = typeof ( payload ) === 'object' ?
                payload :
                {};

            // Convert to a string
            const payloadString = JSON.stringify( payload );

            // Return response
            res.setHeader( 'Content-Type', 'application/json' );
            res.writeHead( statusCode );
            res.end( payloadString );

            // Log The requested data
            console.log(
                '------------------- New Request ---------------------- \n' +
                `- Request recieved on path: ${trimmedPath}\n` +
                `- with this method: ${method}\n` +
                `- with these query string parameters: ${JSON.stringify( queryStringObject )}\n` +
                `- Request recieved with these headers ${JSON.stringify( headers )}\n` +
                `- Request recieved with this payload: ${buffer}\n`
            );
        });
    });
};

// Create the  http server object
const httpServer = http.createServer(( req, res ) => {
    unifiedServer( req, res );
});

// Create the  https server object
const httpsServerOptions = {
    'cert': fs.readFileSync( './https/cert.pem' ),
    'key': fs.readFileSync( './https/key.pem' ),
};

const httpsServer = https.createServer( httpsServerOptions, ( req, res ) => {
    unifiedServer( req, res );
});


/**
 * The server is started with calling the server.listen method
 *  The server is set in a 'keep-alive' state
 * The server has a listening event
 * The server.listen takes two variables, however it can take more
 *  The first var specifies wich port the server opens on (here it is port 3000)
 *  The second var is a callback function which will be assigned to the listening event
 */
httpServer.listen( config.httpPort, () => {
    console.log( `The http server is listening on port: ${config.httpPort} in ${config.envName} mode` );
});

httpsServer.listen( config.httpsPort, () => {
    console.log( `The https server is listening on port ${config.httpsPort} in ${config.envName} mode` );
});
