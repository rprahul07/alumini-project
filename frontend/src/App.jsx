import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import AdminRoutes from './routes/AdminRoutes';
import AuthPage from './layouts/AuthPage';

function App() {
  // Check if user is logged in and get their role
  const getUserRole = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      const user = JSON.parse(userData);
      return user.role?.toLowerCase();
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      return null;
    }
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Default route */}
        <Route 
          path="/" 
          element={
            (() => {
              const role = getUserRole();
              if (!role) return <Navigate to="/login" replace />;
              return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
            })()
          } 
        />
        
        {/* Auth routes */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Regular user routes */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
