import { useState, useCallback } from 'react';

const useAlert = (initialState = null) => {
  const [alert, setAlert] = useState(initialState);

  const showAlert = useCallback((message, type = 'error') => {
    setAlert({ message, type });
    // Auto clear after 5 seconds
    setTimeout(() => {
      setAlert(null);
    }, 5000);
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

  const AlertComponent = useCallback(() => {
    if (!alert) return null;

    return (
      <div
        className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${
          alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
        role="alert"
      >
        {alert.message}
      </div>
    );
  }, [alert]);

  return {
    alert,
    showAlert,
    clearAlert,
    handleError,
    AlertComponent
  };
};

export default useAlert; 