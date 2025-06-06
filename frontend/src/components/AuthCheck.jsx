import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (token) {
    // If logged in, redirect admins to admin logs, others to /dashboard (which redirects to their role dashboard)
    return <Navigate to={userRole === 'admin' ? '/admin/logs' : '/dashboard'} replace />;
  }

  return children;
};

export default AuthCheck; 