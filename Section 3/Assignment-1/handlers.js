/**
 * Handlers
 */
const handlers = {};

// Ping handler
handlers.ping = function(callback) {
    callback(200);
}

// hello handler
handlers.hello = function(callback) {
    // Callback a HTTP status code and a payload object
    callback(200, {'hello': 'World!'});
};

// Not found handler
handlers.notFound = function(callback) {
    callback(404);
};


/**
 * Routing
 */
const router = {
    'ping': handlers.ping,
    'hello': handlers.hello,
    'notFound': handlers.notFound
};

module.exports = router;