import { useState, useCallback } from 'react';

const useAlert = (initialState = null) => {
  const [alert, setAlert] = useState(initialState);

  const showAlert = useCallback((message, type = 'error') => {
    setAlert({ message, type });
  }, []);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const handleError = useCallback((error) => {
    let message = 'An unexpected error occurred';
    let type = 'error';

    // Handle different error formats
    if (typeof error === 'string') {
      message = error;
    } else if (error?.response?.data?.message) {
      // Axios error response
      message = error.response.data.message;
    } else if (error?.message) {
      // Standard error object
      message = error.message;
    } else if (error?.error) {
      // API error format
      message = error.error;
    }

    // Handle specific error cases
    if (message.includes('Email already exists')) {
      message = 'This email is already registered. Please try logging in or use a different email.';
    } else if (message.includes('Invalid credentials')) {
      message = 'Invalid email or password. Please try again.';
    } else if (message.includes('Network Error')) {
      message = 'Unable to connect to the server. Please check your internet connection.';
    }

    showAlert(message, type);
  }, [showAlert]);

  return {
    alert,
    showAlert,
    clearAlert,
    handleError,
  };
};

export default useAlert; 