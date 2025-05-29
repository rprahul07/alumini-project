/**
 * Validates required environment variables
 * @param {string[]} requiredVars - Array of required environment variable names
 * @throws {Error} If any required variables are missing
 */
export function validateEnv(requiredVars) {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Gets an environment variable with a default value
 * @param {string} name - Environment variable name
 * @param {any} defaultValue - Default value if environment variable is not set
 * @returns {any} Environment variable value or default value
 */
export function getEnv(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined) {
    console.warn(`Warning: Environment variable ${name} not set, using default value`);
    return defaultValue;
  }
  return value;
}

/**
 * Gets a required environment variable
 * @param {string} name - Environment variable name
 * @throws {Error} If environment variable is not set
 * @returns {string} Environment variable value
 */
export function getRequiredEnv(name) {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
} 