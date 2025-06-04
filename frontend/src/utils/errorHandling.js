/**
 * Extracts error message from various error response formats
 * @param {Error|Object} error - The error object to process
 * @returns {Object} An object containing the error message and any additional details
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return { message: 'An unknown error occurred' };
  }

  // If error is already in our format, return it
  if (error.message && typeof error.message === 'string') {
    return { message: error.message };
  }

  // Handle axios error responses
  if (error.response) {
    const { data, status } = error.response;
    
    // If server provided an error message
    if (data && data.message) {
      return { message: data.message, status };
    }

    // If server provided error details
    if (data && data.error) {
      return { message: data.error, status };
    }

    // Generic error based on status
    return {
      message: `Request failed with status ${status}`,
      status
    };
  }

  // Handle network errors
  if (error.request) {
    return { message: 'Network error - please check your connection' };
  }

  // Handle other types of errors
  return { 
    message: error.toString() || 'An unexpected error occurred'
  };
};

/**
 * Validates a single form field
 * @param {string} fieldName - The name of the field to validate
 * @param {any} value - The value to validate
 * @param {Object} rules - Validation rules for the field
 * @returns {string|null} Error message if validation fails, null if passes
 */
export const validateField = (fieldName, value, rules = {}) => {
  if (!rules) return null;

  // Required field validation
  if (rules.required && (!value || value.trim() === '')) {
    return `${fieldName} is required`;
  }

  // Email validation
  if (rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }

  // Minimum length validation
  if (rules.minLength && value && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // Maximum length validation
  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `${fieldName} must not exceed ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && value) {
    const pattern = new RegExp(rules.pattern);
    if (!pattern.test(value)) {
      return rules.patternMessage || `${fieldName} format is invalid`;
    }
  }

  // Match validation (e.g., for password confirmation)
  if (rules.match && value !== rules.match.value) {
    return rules.match.message || `${fieldName} does not match`;
  }

  return null;
}; 