import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  // Token handled via HTTP-only cookies, check user data
  const user = localStorage.getItem('user');
  const userRole = localStorage.getItem('userRole');

  if (user) {
    // If logged in, redirect admins to admin logs, others to /dashboard (which redirects to their role dashboard)
    return <Navigate to={userRole === 'admin' ? '/admin/logs' : '/dashboard'} replace />;
  }

  return children;
};

export default AuthCheck; 