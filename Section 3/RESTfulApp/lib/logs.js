/**
 * Library for storing and locating logs
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


// Constainer for the module
const lib = {};

// Base directory of the logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file. create the file if it does not exist.
lib.append = function (file, str, callback) {
    // Open the file for appending
    fs.open(`${lib.baseDir}${file}.log`, 'a', (err, fielDescriptor) => {
        if (!err && fielDescriptor) {
            // Append to the file and close it
            return fs.appendFile(fielDescriptor, `${str}\n`, (err) => {
                if (!err) {
                    return fs.close(fielDescriptor, (err) => {
                        if (!err) {
                            return callback(false);
                        }

                        return callback('Error closing file that was being appended');
                    });
                }

                return callback('Error appending to the file');
            });
        }

        return callback('Could not open file for appending');
    });
};

// List all the logs, and optionally include the compressed logs
lib.list = function (includeCompressedLogs, callback) {
    fs.readdir(lib.baseDir, (err, data) => {
        if (!err && data && data.length > 0) {
            const trimmedFileNames = [];

            data.forEach((fileName) => {
                // Add the .log files
                if (fileName.indexOf('.log') > -1) {
                    trimmedFileNames.push(fileName.replace('.log', ''));
                }

                // Add on the .gz files
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs === true) {
                    trimmedFileNames.push(fileName.replace('.gz.b64', ''));
                }

            });

            return callback(false, trimmedFileNames);
        }

        return callback(err, data);
    });
};

// Compress the contents of one .log file into a .gz.b64 file within the same directory
lib.compress = function (logId, newFileId, callback) {
    const sourceFile = `${logId}.log`;
    const destFile = `${newFileId}.gz.b64`;

    // Read the source file
    fs.readFile(`${lib.baseDir}${sourceFile}`, 'utf8', (err, inputString) => {
        if (!err && inputString) {
            // Compress the data using gzip
            return zlib.gzip(inputString, (err, buffer) => {
                if (!err && buffer) {
                    // SEnd the data to the destination file
                    return fs.open(`${lib.baseDir}${destFile}`, 'wx', (err, fileDescriptor) => {
                        if (!err && fileDescriptor) {
                            return fs.writeFile(fileDescriptor, buffer.toString('base64'), (err) => {
                                if (!err) {
                                    // Close the destination file
                                    return fs.close(fileDescriptor, (err) => {
                                        if (!err) {
                                            return callback(false);
                                        }

                                        return callback(err);
                                    });
                                }
                                
                                return callback(err);
                            });
                        }

                        return callback(err);
                    });
                }

                return callback(err);
            });
        }

        return callback(err);
    });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = function (fileId, callback) {
    const fileName = `${fileId}.gz.b64`;

    fs.readFile(`${lib.baseDir}${fileName}`, 'utf8', (err, str) => {
        if (!err && str) {
            // Decompress the data
            const inputbuffer = Buffer.from(str, 'base64');

            return zlib.unzip(inputbuffer, (err, outputBuffer) => {
                if (!err && outputBuffer) {
                    // Callback
                    const str = outputBuffer.toString();

                    return callback(false, str);
                }

                return callback(err);
            });
        }

        return callback(err);
    });
};

// Truncate a log file
lib.truncate = function (logId, callback) {
    fs.truncate(`${lib.baseDir}${logId}.log`, 0, (err) => {
        if (!err) {
            return callback(false);
        }

        return callback(err);
    });
};


// Export the module
module.exports = lib;
