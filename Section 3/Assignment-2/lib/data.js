/**
 * Library for storing and editing data
 * utilizing promises
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const helpers = require('./helpers');
const config = require('./config');

// Converts the fs methods from callback functions to promise functions
const promiseFs = {
  open: promisify(fs.open),
  write: promisify(fs.writeFile),
  close: promisify(fs.close),
  truncate: promisify(fs.truncate),
  readFile: promisify(fs.readFile),
  unlink: promisify(fs.unlink),
};


// Container for the module
const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = async function createAndWriteToFile(dir, file, data) {
  try {
    // Open the file and return a filedesciptor
    const fileDescriptor = await promiseFs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx');

    // Write to file and close it
    const stringData = JSON.stringify(data);
    await promiseFs.write(fileDescriptor, stringData);
    await promiseFs.close(fileDescriptor);

    return Promise.resolve();
  } catch (error) {
    switch (error.code) {
      case 'EEXIST': {
        const err = Error(`${dir}: ${file} already exist`);
        err.statusCode = config.statusCode.badRequest;

        return Promise.reject(err);
      }

      default: {
        const err = new Error(`Could not create the new ${dir}`);
        err.statusCode = config.statusCode.internalServerError;

        return err;
      }
    }
  }
};


// Read data from a file
lib.read = async function readFileFromDirectory(dir, file) {
  try {
    const data = await promiseFs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8');
    const parsedData = helpers.parseJsonToObject(data);

    return parsedData;
  } catch (error) {
    switch (error.code) {
      case 'ENOENT': {
        const err = Error(`${dir}: ${file} does not exist`);
        err.statusCode = config.statusCode.notFound;

        return Promise.reject(err);
      }

      default: {
        const err = new Error('Internal server error.');
        err.statusCode = config.statusCode.internalServerError;

        return err;
      }
    }
  }
};


// Update data inside a file
lib.update = async function updateFileInDirectory(dir, file, data) {
  try {
    // Open the file
    const fileDescriptor = await promiseFs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+');

    // Truncate the file
    await promiseFs.truncate(fileDescriptor);

    // Write to the file and close it
    const stringData = JSON.stringify(data);
    await promiseFs.write(fileDescriptor, stringData);
    await promiseFs.close(fileDescriptor);

    return Promise.resolve();
  } catch (error) {
    const err = new Error('Internal server error.');
    err.statusCode = config.statusCode.internalServerError;

    return err;
  }
};


// Delete a file
lib.delete = function deleteFileFromDirectory(dir, file) {
  try {
    // Unlink the file
    return promiseFs.unlink(`${lib.baseDir}${dir}/${file}.json`);
  } catch (error) {
    const err = new Error('Internal server error.');
    err.statusCode = config.statusCode.internalServerError;

    return err;
  }
};


// Exporting module
module.exports = lib;
