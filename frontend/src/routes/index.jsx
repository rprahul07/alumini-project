import React from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import AuthPage from '../layouts/AuthPage';
import Dashboard from '../layouts/Dashboard';
import AdminLogin from '../layouts/AdminLogin';
import ActivityLogs from '../layouts/ActivityLogs';
import RoleSelection from '../layouts/RoleSelection';

// Error Pages Components
const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Auth check wrapper
const AuthCheck = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (token) {
    return <Navigate to={userRole === 'admin' ? '/admin/logs' : '/dashboard'} replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/role-selection" replace />,
  },
  {
    path: '/role-selection',
    element: (
      <AuthCheck>
        <RoleSelection />
      </AuthCheck>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthCheck>
        <AuthPage authType="login" />
      </AuthCheck>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthCheck>
        <AuthPage authType="register" />
      </AuthCheck>
    ),
  },
  {
    path: '/admin',
    element: (
      <AuthCheck>
        <AdminLogin />
      </AuthCheck>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['student', 'alumni', 'faculty']}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/logs',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ActivityLogs />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
