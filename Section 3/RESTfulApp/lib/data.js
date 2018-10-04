/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for the module (to be exported)
const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
    // Open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        console.log(fileDescriptor);

        if (!err && fileDescriptor) {
            // Convert data to a string
            const stringData = JSON.stringify(data);

            // Write to file and closet it
            return fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    return fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            return callback(false);
                        }

                        return callback('Error closing new file');
                    });
                }

                return callback('Error writing to new file');
            });
        }

        return callback('Could not create new file, it may already exist');
    });
};

// Read data from a file
lib.read = function (dir, file, callback) {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
        if (!err && data) {
            const parsedData = helpers.parseJsonToObject(data);

            return callback(false, parsedData);
        }

        return callback(err, data);
    });
};

// Update data inside a file
lib.update = function (dir, file, data, callback) {
    // Open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to a string
            const stringData = JSON.stringify(data);

            // Truncate the file
            return fs.truncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write to the file and close it
                    return fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            return fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    return callback(false);
                                }

                                return callback('Error closing file');
                            });
                        }

                        return callback('Error writing to existing file');
                    });
                }

                return callback('Error truncating file');
            });
        }

        return callback('Could not open the file for updating, it may not exist yet');
    });
};

// Delete a file
lib.delete = function (dir, file, callback) {
    // Unlink the file
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
        if (!err) {
            return callback(false);
        }

        return callback('Error deleting file');
    });
};

// List all the items in a directory
lib.list = function (dir, callback) {
    fs.readdir(`${lib.baseDir}${dir}/`, (err, data) => {
        if (!err && data && data.length > 0) {
            const trimmedFilenames = [];

            data.forEach((fileName) => {
                trimmedFilenames.push(fileName.replace('.json', ''));
            });

            return callback(false, trimmedFilenames);
        }

        return callback(err, data);
    });
};

module.exports = lib;
