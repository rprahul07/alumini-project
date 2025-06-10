import { useState } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState(null); // { message: '...', type: 'success' | 'error' }

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null); // Clear alert after some time
    }, 5000); // 5 seconds
  };

  const AlertComponent = () => alert && (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${
        alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
      role="alert"
    >
      {alert.message}
    </div>
  );

  return { showAlert, AlertComponent };
};

export default useAlert;