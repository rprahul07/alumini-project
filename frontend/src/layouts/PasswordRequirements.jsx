import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const PasswordRequirements = ({ passwordRequirements, password = '' }) => {
  const requirements = [
    {
      text: `At least ${passwordRequirements.minLength} characters long`,
      check: (password) => password.length >= passwordRequirements.minLength,
    },
    {
      text: 'Contains at least one uppercase letter',
      check: (password) => passwordRequirements.requireUppercase ? /[A-Z]/.test(password) : true,
    },
    {
      text: 'Contains at least one lowercase letter',
      check: (password) => passwordRequirements.requireLowercase ? /[a-z]/.test(password) : true,
    },
    {
      text: 'Contains at least one number',
      check: (password) => passwordRequirements.requireNumber ? /[0-9]/.test(password) : true,
    },
    {
      text: 'Contains at least one special character',
      check: (password) => passwordRequirements.requireSpecialChar ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
    },
  ];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
      <ul className="space-y-2">
        {requirements.map((requirement, index) => {
          const isMet = requirement.check(password);
          return (
            <li key={index} className="flex items-center text-sm">
              <span className={`mr-2 ${isMet ? 'text-green-500' : 'text-red-500'}`}>
                {isMet ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
              </span>
              <span className={isMet ? 'text-green-700' : 'text-red-700'}>
                {requirement.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordRequirements; 