import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import { authAPI } from './services/api';

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authAPI.checkAuth();
        setIsAuthenticated(true);
        setUserRole(data.role);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, []);

  // Apply security headers
  useEffect(() => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key.toLowerCase()}`, value);
    });
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <AuthPage onAuthSuccess={(role) => {
                setIsAuthenticated(true);
                setUserRole(role);
              }} />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['alumni', 'faculty', 'student']}>
                <div>Dashboard (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />

          {/* Unauthorized Route */}
          <Route 
            path="/unauthorized" 
            element={<div>You are not authorized to access this page.</div>} 
          />
          
          {/* Redirect root to auth page if not authenticated, dashboard if authenticated */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/auth" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 