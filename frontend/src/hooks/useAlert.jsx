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
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] px-8 py-4 rounded-xl shadow-2xl text-white text-lg font-semibold flex items-center justify-center
          transition-all duration-500
          ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          animate-fade-in-up
        `}
        role="alert"
        style={{ minWidth: 240, maxWidth: 400, textAlign: 'center' }}
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

// Add this to your global CSS (e.g., index.css or tailwind.css):
// .animate-fade-in-up {
//   @apply opacity-0 translate-y-4;
//   animation: fadeInUp 0.5s forwards;
// }
// @keyframes fadeInUp {
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// } 