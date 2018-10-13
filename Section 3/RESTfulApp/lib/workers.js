/**
 * Worker related tasks
 */

// Dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const _data = require('./data');
const _logs = require('./logs');
const config = require('./config');
const helpers = require('./helpers');
const util = require('util');
const debug = util.debuglog('workers');

// Instantiate the worker object
const workers = {};

// Lookup all the checks, get their data, send to a validator
workers.gatherAllChecks = function lookupAllChecks() {
    // Get all the checks
    _data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // Read in the check data
                _data.read('checks', check, (err, originalCheckData) => {
                    if (!err && originalCheckData) {
                        // Pass it to the check validator, and let that function continue or log errors as needed
                        workers.validateCheckData(originalCheckData);
                    } else {
                        debug('Error: reading one of the check\'s data');
                    }
                });
            });
        } else {
            debug('Error: could not find any checks to process');
        }
    });
};

// Sanity-check the check-data
workers.validateCheckData = function validateDataOfAllChecks(originalCheckData) {
    originalCheckData = typeof (originalCheckData) === 'object'
        && originalCheckData !== null
        ? originalCheckData
        : {};

    originalCheckData.id = typeof (originalCheckData.id) === 'string'
        && originalCheckData.id.trim().length === config.checkIdLength
        ? originalCheckData.id.trim()
        : false;

    originalCheckData.userPhone = typeof (originalCheckData.userPhone) === 'string'
        && originalCheckData.userPhone.trim().length === config.stdPhoneLength
        ? originalCheckData.userPhone.trim()
        : false;

    originalCheckData.protocol = typeof (originalCheckData.protocol) === 'string'
        && ['http', 'https'].indexOf(originalCheckData.protocol.trim()) > -1
        ? originalCheckData.protocol.trim()
        : false;

    originalCheckData.url = typeof (originalCheckData.url) === 'string'
        && originalCheckData.url.trim().length > 0
        ? originalCheckData.url.trim()
        : false;

    originalCheckData.method = typeof (originalCheckData.method) === 'string'
        && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method.trim()) > -1
        ? originalCheckData.method.trim()
        : false;

    originalCheckData.successCodes = typeof (originalCheckData.successCodes) === 'object'
        && originalCheckData.successCodes instanceof Array
        && originalCheckData.successCodes.length > 0
        ? originalCheckData.successCodes
        : false;

    originalCheckData.timeoutSeconds = typeof (originalCheckData.timeoutSeconds) === 'number'
        && originalCheckData.timeoutSeconds % 1 === 0
        && originalCheckData.timeoutSeconds >= config.timeoutSeconds.min
        && originalCheckData.timeoutSeconds <= config.timeoutSeconds.max
        ? originalCheckData.timeoutSeconds
        : false;

    // Set the new keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state = typeof (originalCheckData.state) === 'string'
        && ['up', 'down'].indexOf(originalCheckData.state.trim()) > -1
        ? originalCheckData.state.trim()
        : 'down';

    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) === 'number'
        && originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    // If all the checks pass, pass th edata along to the next step in the process
    if (originalCheckData.id
        && originalCheckData.userPhone
        && originalCheckData.protocol
        && originalCheckData.url
        && originalCheckData.method
        && originalCheckData.successCodes
        && originalCheckData.timeoutSeconds) {
        workers.performCheck(originalCheckData);
    } else {
        debug('Error: one of the checks is not properly formatted. Skipping it');
        debug(originalCheckData);
    }
};


// Perform the check, send the originalCheckData and the outcome of the check process, to the next step in the process
workers.performCheck = function performAllChecks(originalCheckData) {
    // Prepare the initial check outcome
    const checkOutcome = {
        error: false,
        responseCode: false,
    };

    // Mark that the outcome has not been sent yet
    let outcomeSent = false;

    // Parse the hostname and the path out of the originalCheckData
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostName = parsedUrl.hostname;

    // Using 'path' and not 'pathname' because we want the query string
    const { path } = parsedUrl;

    // Construct the request
    const oneSecondInMilliseconds = 1000;
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSeconds * oneSecondInMilliseconds,
    };

    // Istantiate the request object (using either the http or https module)
    const _moduleToUse = originalCheckData.protocol === 'http'
        ? http
        : https;

    const req = _moduleToUse.request(requestDetails, (res) => {
        // Grab the status of the sent request
        const status = res.statusCode;

        // Update the checkoutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.procesCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the error event so it doesnt get trown
    req.on('error', (err) => {
        // Update the checkoutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: err,
        };

        if (!outcomeSent) {
            workers.procesCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the timeout event
    req.on('timeout', () => {
        // Update the checkoutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: 'timeout',
        };

        if (!outcomeSent) {
            workers.procesCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // End the request
    req.end();
};

/**
 * Process the check outcome, update the check data as needed, trigger an alert if needed
 * Special logic for accomodating a check that has never been tested before (don't alert on that one)
 */
workers.procesCheckOutcome = function procesOutcomeOfCheck(originalCheckData, checkOutcome) {
    // Decide if the check is considere up or down in its current state
    const state = !checkOutcome.error
        && checkOutcome.responseCode
        && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
        ? 'up'
        : 'down';

    // Decide if an alert is waranted
    const alertWaranted = originalCheckData.lastChecked
        && originalCheckData.state !== state
        ? true
        : false;

    const timeOfCheck = Date.now();

    // Update the checkData
    const newCheckData = originalCheckData;

    // Log the data
    workers.log(originalCheckData, checkOutcome, state, alertWaranted, timeOfCheck);

    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    // Save the updates
    _data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            // Send the new checkData to the next phase in the process if needed
            if (alertWaranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                debug('Check outcome has not changed, no alert needed');
            }
        } else {
            debug('Error trying to save updats to one of the checks');
        }
    });
};

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = function alertUserToStatusChanges(newCheckData) {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

    helpers.sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            debug('Success: User was alerted to a status change in their check, via sms', msg);
        } else {
            debug('Error: Could not send sms alert to user who had a state change in their check');
        }
    });
};

// 
workers.log = function logCheckData(originalCheckData, checkOutcome, state, alertWaranted, timeOfCheck) {
    // Form the log data
    const logData = {
        state,
        check: originalCheckData,
        outcome: checkOutcome,
        alert: alertWaranted,
        time: timeOfCheck,
    };

    // Convert data to a string
    const logString = JSON.stringify(logData);

    // Determine the name of the log file
    const logFileName = originalCheckData.id;

    // Append the log stribng to the file
    _logs.append(logFileName, logString, (err) => {
        if (!err) {
            debug('Logging to file succeeded');
        } else {
            debug('Logging to file failed');
        }
    });
};

// Timer to execute the workers-process once per minute
workers.loop = function timerToExecuteCheck() {
    const oneMinuteInMilliseconds = 60000;

    setInterval(() => {
        workers.gatherAllChecks();
    }, oneMinuteInMilliseconds);
};

// Rotate (compress) the log files
workers.rotateLogs = function rotateLogFiles() {
    // List all the (non compressed) log files
    _logs.list(false, (err, logs) => {
        if (!err && logs && logs.length > 0) {
            logs.forEach((logName) => {
                // Compress the data to a different file
                const logId = logName.replace('.log', '');
                const newFileId = `${logId}-${Date.now()}`;

                _logs.compress(logId, newFileId, (err) => {
                    if (!err) {
                        // Truncate the log
                        _logs.truncate(logId, (err) => {
                            if (!err) {
                                debug('Success truncating logFile');
                            } else {
                                debug('Error truncating logFile');
                            }
                        });
                    } else {
                        debug('Error compressing one of the log files', err);
                    }
                });
            });
        } else {
            debug('Error could not find any logs to rotate');
        }
    });
};

// Timer to execute the log-rotation process once per day
workers.logRotationLoop = function timerToExecuteLogRotation() {
    const oneDayInMilliseconds = 86400000;

    setInterval(() => {
        workers.rotateLogs();
    }, oneDayInMilliseconds);
};

// Init function
workers.init = function initializeWorkers() {

    // Send to console, in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

    // Execute all the checks immediatly
    workers.gatherAllChecks();

    // Call the loop so the checks will execute later on
    workers.loop();

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
};

// Export the module
module.exports = workers;
