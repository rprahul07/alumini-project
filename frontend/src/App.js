import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard';
import ActivityLogs from './components/Admin/ActivityLogs';
import AdminLogin from './components/Admin/AdminLogin';
import './App.css';

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Admin route protection component
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    if (token && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const handleAuthSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
  };

  // Apply security headers
  useEffect(() => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key.toLowerCase()}`, value);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/auth"
            element={
              !isAuthenticated ? (
                <AuthPage onAuthSuccess={handleAuthSuccess} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/admin/login"
            element={
              !isAuthenticated ? (
                <AdminLogin onAuthSuccess={handleAuthSuccess} />
              ) : (
                <Navigate to="/admin/logs" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} userRole={userRole} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/admin/logs"
            element={
              isAuthenticated ? (
                <AdminRoute>
                  <ActivityLogs />
                </AdminRoute>
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 