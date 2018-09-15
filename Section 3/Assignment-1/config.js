/**
 * Create and exprot configuration variables
 */

 // Container for all the envirenments
 const environments = {};

 // Staging (default) environment
 environments.staging = {
    'httpPort': 3000,
    'envName': 'staging'
 };

 // Production environment
 environments.production = {
    'httpPort': 3000,
    'envName': 'production'
 };


 // Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if no, default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
