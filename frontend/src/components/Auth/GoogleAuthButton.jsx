import React from 'react';

const GoogleAuthButton = ({ children, onClick, disabled }) => {
  return (
    <button
      className="google-auth-btn"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

export default GoogleAuthButton; 