import { toast } from 'react-toastify';

const useAlert = (initialState = null) => {
  // No need for local alert state, use react-toastify

  const showAlert = (message, type = 'error') => {
    if (type === 'success') toast.success(message);
    else if (type === 'info') toast.info(message);
    else if (type === 'warning') toast.warn(message);
    else toast.error(message);
  };

  const handleError = (error) => {
    let message = 'An unexpected error occurred';
    let type = 'error';
    if (typeof error === 'string') {
      message = error;
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error) {
      message = error.error;
    }
    if (message.includes('Email already exists')) {
      message = 'This email is already registered. Please try logging in or use a different email.';
    } else if (message.includes('Invalid credentials')) {
      message = 'Invalid email or password. Please try again.';
    } else if (message.includes('Network Error')) {
      message = 'Unable to connect to the server. Please check your internet connection.';
    }
    showAlert(message, type);
  };

  // No AlertComponent needed
  return {
    showAlert,
    handleError,
  };
};

export default useAlert; 