/* eslint "capitalized-comments": 0 */
/* eslint "curly": 0 */
/* eslint "no-undef": 0 */
/* eslint "func-style": 0 */
/* eslint "consistent-return": 0 */
/* eslint "no-unused-vars": 0 */
/* eslint "no-unused-expressions": 0 */
/* eslint "max-statements-per-line": 2 */
/* eslint "no-lonely-if": 0 */
/* eslint "no-empty-function": 0 */


const url = require('url');
const http = require('http');
const { StringDecoder } = require('string_decoder');


const server = http.createServer((req, res) => {
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
    const chosenHandler = typeof server.router[trimmedPath] !== 'undefined'
      ? server.router[trimmedPath]
      : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      headers,
      method,
      queryStringObject,
      trimmedPath,
      payload: helpers.parseJsonToObject(buffer),
    };

    console.log(req);

    return res.end('hello');
  });
});

server.listen(3000, () => console.log('server is listening'));
