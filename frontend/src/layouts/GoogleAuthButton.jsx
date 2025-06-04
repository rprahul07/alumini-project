import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleAuthButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 mb-6
        text-gray-700 bg-white border border-gray-300 rounded-md
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <FcGoogle className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton; 