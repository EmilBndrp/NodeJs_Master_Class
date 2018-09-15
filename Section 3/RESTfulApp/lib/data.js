/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module (to be exported)
const lib = {};

 lib.baseDir = path.join(__dirname,'/../.data/');

// write data to a file
lib.create = function(dir, file, data, callback) {
    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        console.log(fileDescriptor);
        
        if (!err && fileDescriptor) {
            //convert data to a string
            const stringData = JSON.stringify(data);

            //write to file and closet it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
}

// Read data from a file
lib.read = function (dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data);
    });
}

//update data inside a file
lib.update = function (dir, file, data, callback) {
    // Open the file for writing
    fs.open (lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //convert data to a string
            const stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate (fileDescriptor, (err) => {
                if (!err) {
                    // Write to the file and close it
                    fs.writeFile (fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close (fileDescriptor, (err) => {
                                if (!err) {
                                    callback (false);
                                } else {
                                    callback ('Error closing file');
                                }
                            });
                        } else {
                            callback ('Error writing to existing file');
                        }
                    });
                } else {
                    callback ('Error truncating file');
                }
            })
        } else {
            callback ('Could not open the file for updating, it may not exist yet');
        }
    });
};

// Delete a file
lib.delete = function (dir, file, callback) {
    //unlink the file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
}



 module.exports = lib;

 /**
 * Test
 *//*
lib.create('test', 'newFile', {'hello': 'world'}, (err) =>{
    console.log(err);
})
setTimeout(() => lib.update('test', 'newFile', {'fizz': 'buzz'}, (err) => {
    console.log(err);
}), 10000);
*/