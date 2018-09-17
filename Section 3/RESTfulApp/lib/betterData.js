/**
 * Library for storing and editing data
 * utilizing promises
 * 
 * TODO:
 *  - configure functions to work with a callback
 */

 
// Dependencies
const fs = require('fs');
const path = require('path');
const util = require('util');

// converts the fs methods from callback functions to promise functions
const _fs = {
    open: util.promisify(fs.open),
    write: util.promisify(fs.writeFile),
    close: util.promisify(fs.close),
    truncate: util.promisify(fs.ftruncate)
};


/**
 *  Container for the module
 */
const lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');


// write data to a file
lib.create = function(dir, file, data) {

    // Open the file
    _fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx')

    // Write to the file
    .then(fileDescriptor => {
        const stringData = JSON.stringify(data)
        _fs.write(fileDescriptor, stringData)
        return fileDescriptor
    })

    // Close the file
    .then(fileDescriptor => _fs.close(fileDescriptor))

    // Catch any errors
    .catch(err => console.log(err));
};


// Read data from a file
lib.read = function (dir, file, callback) {

    // Read the file
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data);
    });
};


//update data inside a file
lib.update = function(dir, file, data) {

    // Open the file
    _fs.open (lib.baseDir + dir + '/' + file + '.json', 'r+')

    // Truncate the file
    .then(fileDescriptor => {
        _fs.truncate(fileDescriptor)
        return fileDescriptor
    })

    // Write to the file
    .then(fileDescriptor => {
        const stringData = JSON.stringify(data);
        _fs.write(fileDescriptor, stringData)
        return fileDescriptor
    })

    // Close the file
    .then(fileDescriptor => _fs.close(fileDescriptor))

    // Catch any errors
    .catch(err => console.log(err));
};


// Delete a file
lib.delete = function (dir, file, callback) {

    //unlink the file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        callback(err);
    });
};


// Exporting module
module.exports = lib;


/**
 * test
 *//*
lib.create('test', 'newFile', {'hello': 'world'});
setTimeout(() => lib.update('test', 'newFile', {'fizz': 'buzz'}), 10000);
*/