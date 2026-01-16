import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
const AdminRoutes = React.lazy(() => import('./routes/AdminRoutes'));
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { useAnalytics } from './hooks/useAnalytics';
import ConsentBanner from './components/ConsentBanner';
import ScrollToTop from './components/ScrollToTop';

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
        <ScrollToTop />
        <RouteTracker />
        <Toaster position="top-right" />
        <Routes>
          {/* Admin routes (leave untouched) */}
          <Route path="/admin/*" element={
            <React.Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            }>
              <AdminRoutes />
            </React.Suspense>
          } />
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
