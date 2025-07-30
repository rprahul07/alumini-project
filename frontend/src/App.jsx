import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import AdminRoutes from './routes/AdminRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
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
    </AuthProvider>
  );
}

export default App;
