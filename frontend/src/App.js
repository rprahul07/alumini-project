import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard';
import './App.css';

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

  // Optionally, you can add logic to check authentication status on mount
  // and handle CSRF as needed, depending on your backend setup.

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
                <AuthPage onAuthSuccess={(role) => {
                  setIsAuthenticated(true);
                  setUserRole(role);
                }} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={() => setIsAuthenticated(false)} userRole={userRole} />
              ) : (
                <Navigate to="/auth" replace />
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