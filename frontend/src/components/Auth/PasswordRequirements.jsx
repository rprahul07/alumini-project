import React from 'react';

const PasswordRequirements = ({ passwordRequirements }) => (
  <div className="password-requirements">
    <p>Password must:</p>
    <ul>
      <li>Be at least {passwordRequirements.minLength} characters long</li>
      <li>Contain at least one uppercase letter</li>
      <li>Contain at least one lowercase letter</li>
      <li>Contain at least one number</li>
      <li>Contain at least one special character</li>
    </ul>
  </div>
);

export default PasswordRequirements; 