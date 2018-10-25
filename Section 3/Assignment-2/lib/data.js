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
const { promisify } = require('util');
const helpers = require('./helpers');

// Converts the fs methods from callback functions to promise functions
const promiseFs = {
  open: promisify(fs.open),
  write: promisify(fs.writeFile),
  close: promisify(fs.close),
  truncate: promisify(fs.ftruncate),
  read: promisify(fs.read),
  unlink: promisify(fs.unlink),
};


// Container for the module
const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = async function createAndWriteToFile(dir, file, data) {
  // Open the file and return a filedesciptor
  const fileDescriptor = await promiseFs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx');

  // Write to file and close it
  const stringData = JSON.stringify(data);
  await promiseFs.write(fileDescriptor, stringData);
  await promiseFs.close(fileDescriptor);
};

// Read data from a file
lib.read = function readFileFromDirectory(dir, file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
      if (!err && data) {
        const parsedData = helpers.parseJsonToObject(data);

        return resolve(parsedData);
      }

      return reject(err);
    });
  });
};

// Update data inside a file
lib.update = async function updateFileInDirectory(dir, file, data) {
  // Open the file
  const fileDescriptor = await promiseFs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+');

  // Truncate the file
  await promiseFs.truncate(fileDescriptor);

  // Write to the file and close it
  const stringData = JSON.stringify(data);
  await promiseFs.write(fileDescriptor, stringData);
  await promiseFs.close(fileDescriptor);
};

// Delete a file
lib.delete = function deleteFileFromDirectory(dir, file) {
  // Unlink the file
  return promiseFs.unlink(`${lib.baseDir}${dir}/${file}.json`);
};

// Exporting module
module.exports = lib;
