/**
 * Base file
 */

// Dependencies
const http = require('http');

let port = 3000;

// Function decleration
const server = http.createServer((req, res) => {
    res.end('hello');
});

// Function invocation
server.listen(port,() => {
    console.log('The server is open on port '+ port);
    
});
