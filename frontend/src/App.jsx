import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import AdminRoutes from './routes/AdminRoutes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { useAnalytics } from './hooks/useAnalytics';
import ConsentBanner from './components/ConsentBanner';

// Route tracking component for analytics
function RouteTracker() {
  const location = useLocation();
  const { trackPage } = useAnalytics();

  useEffect(() => {
    // Track page view on route change
    trackPage(location.pathname, document.title);
  }, [location, trackPage]);

  return null;
}

// Separate component to use AuthContext and pass user to BookmarkProvider
function AppContent() {
  const { user } = useAuth();
  
  return (
    <BookmarkProvider user={user}>
      <Router>
        <RouteTracker />
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
        <ConsentBanner />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
