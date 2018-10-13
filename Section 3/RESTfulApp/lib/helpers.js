/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash from string
helpers.hash = function hashString(str) {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', config.hashingSecret)
            .update(str)
            .digest('hex');

        return hash;
    }

    return false;
};

// Parse a JSON string to an object in all cases, without throwing an error
helpers.parseJsonToObject = function parseAlwaysJsonToObject(str) {
    try {
        const obj = JSON.parse(str);

        return obj;
    } catch (err) {
        return {};
    }
};

helpers.createRandomString = function createARandomString(strLength) {
    strLength = typeof (strLength) === 'number'
        && strLength > 0
        ? strLength
        : false;

    if (strLength) {
        // Define all the possible characters that could go int a string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        let str = '';

        for (let i = 1; i <= strLength; i += 1) {
            // Get a random character from the possibleCharacters string
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

            // Append this character to the final string
            str += randomCharacter;
        }

        return str;
    }

    return false;
};

helpers.sendTwilioSms = function sendSmsThroughTwilio(phone, msg, callback) {
    phone = typeof (phone) === 'string'
        && phone.trim().length === config.stdPhoneLength
        ? phone.trim()
        : false;

    msg = typeof (msg) === 'string'
        && msg.trim().length > 0
        && msg.trim().length <= 1600
        ? msg.trim()
        : false;

    console.log(phone, msg);


    if (phone && msg) {
        // Configure the request payload
        const payload = {
            From: config.twilio.fromPhone,
            To: `+45${phone}`,
            Body: msg,
        };

        // Stringify payload and configure the request details
        const stringPayload = querystring.stringify(payload);

        // Configure the request details
        const requestDetails = {
            protocol: 'https:',
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
            auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
            },
        };

        // Instantiate request object
        const req = https.request(requestDetails, (res) => {
            // Grab the status of the sent request
            const status = res.statusCode;

            // Callback successfully if the request went through
            if (status === config.statusCode.ok || status === config.statusCode.created) {
                return callback(false);
            }

            return callback(`Status code returned was ${status}`);
        });

        // Bind the the error event so it doesnt get thrown
        req.on('error', (error) => callback(error));

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
    } else {
        callback('Given parameters were missing or invalid');
    }
};


module.exports = helpers;
