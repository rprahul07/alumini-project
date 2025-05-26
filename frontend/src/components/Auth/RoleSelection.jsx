import React from 'react';

const RoleSelection = ({ authType, setUserRole }) => (
  <div className="role-selection">
    <h2>{authType === 'login' ? 'Login as' : 'Register as'}</h2>
    <div className="role-buttons">
      <button onClick={() => setUserRole('student')}>Student</button>
      <button onClick={() => setUserRole('alumni')}>Alumni</button>
      <button onClick={() => setUserRole('faculty')}>Faculty</button>
    </div>
  </div>
);

export default RoleSelection; 