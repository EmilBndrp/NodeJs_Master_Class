/**
 * Create and exprot configuration variables
 */
/* eslint no-process-env: 0 */
const statusCode = {
  ok: 200,
  created: 201,
  badRequest: 400,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  internalServerError: 500,
};

/**
 * Container for all the envirenments
 * environment variables can set certain varaibles in the application
 * based on a specified runtime environment
 * 
 * it is important to set one envorinment to default
 */
const environments = {};

// Staging (default) environment
environments.staging = {
  statusCode,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  httpPort: 3000,
  httpsPort: 3001,
  tokenLength: 20,
};

// Production environment
environments.production = {
  statusCode,
  envName: 'production',
  hashingSecret: 'thisIsAlsoASecret',
  httpPort: 5000,
  httpsPort: 5001,
  tokenLength: 20,
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string'
  ? process.env.NODE_ENV.toLowerCase()
  : '';

// Check that the current environment is one of the environments above, if no, default to staging
const environmentToExport = typeof (environments[currentEnvironment]) === 'object'
  ? environments[currentEnvironment]
  : environments.staging;

// Export the module
module.exports = environmentToExport;
