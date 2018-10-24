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

// Converts the fs methods from callback functions to promise functions
const promiseFs = {
  open: util.promisify(fs.open),
  write: util.promisify(fs.writeFile),
  close: util.promisify(fs.close),
  truncate: util.promisify(fs.ftruncate),
};

/**
 *  Container for the module
 */
const lib = {};
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function createAndWriteToFile(dir, file, data, callback) {
  // Open the file
  promiseFs
    .open(`${lib.baseDir}${dir}/${file}.json`, 'wx')

    // Write to the file
    .then((fileDescriptor) => {
      const stringData = JSON.stringify(data);
      promiseFs.write(fileDescriptor, stringData);

      return fileDescriptor;
    })

    // Close the file
    .then((fileDescriptor) => {
      promiseFs.close(fileDescriptor);

      return callback();
    })

    // Catch any errors
    .catch((err) => callback(err));
};

// Read data from a file
lib.read = function readFileFromDirectory(dir, file, callback) {
  // Read the file
  fs.readFile(
    `${lib.baseDir}${dir}/${file}.json`,
    'utf-8',
    (err, data) => callback(err, data),
  );
};

// Update data inside a file
lib.update = function updateFileInDirectory(dir, file, data) {
  // Open the file
  promiseFs
    .open(`${lib.baseDir}${dir}/${file}.json`, 'r+')

    // Truncate the file
    .then((fileDescriptor) => {
      promiseFs.truncate(fileDescriptor);

      return fileDescriptor;
    })

    // Write to the file
    .then((fileDescriptor) => {
      const stringData = JSON.stringify(data);
      promiseFs.write(fileDescriptor, stringData);

      return fileDescriptor;
    })

    // Close the file
    .then((fileDescriptor) => promiseFs.close(fileDescriptor))

    // Catch any errors
    .catch((err) => console.log(err));
};

// Delete a file
lib.delete = function deleteFileFromDirectory(dir, file, callback) {
  // Unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    callback(err);
  });
};

// Exporting module
module.exports = lib;
