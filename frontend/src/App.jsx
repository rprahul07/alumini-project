import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import AdminRoutes from './routes/AdminRoutes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

// Separate component to use AuthContext and pass user to BookmarkProvider
function AppContent() {
  const { user } = useAuth();
  
  return (
    <BookmarkProvider user={user}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Admin routes (leave untouched) */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          {/* All other user routes are handled in AppRoutes */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    </BookmarkProvider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
