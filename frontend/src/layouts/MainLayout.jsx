// ✅ Cleaned & Optimized - Layout without Navbar
import React, { useEffect, memo, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = memo(() => {
  const location = useLocation();
  
  // Detect if on a page with dark background
  const isDarkBackgroundPage = ['/events', '/jobs', '/alumni', '/students'].includes(location.pathname);
  
  // Set appropriate background for the page
  const setBackgroundColor = useCallback((isDark) => {
    if (isDark) {
      document.body.style.backgroundColor = '#0f172a'; // slate-900
      document.documentElement.style.backgroundColor = '#0f172a';
    } else {
      document.body.style.backgroundColor = '#f9fafb'; // gray-50
      document.documentElement.style.backgroundColor = '#f9fafb';
    }
  }, []);

  useEffect(() => {
    setBackgroundColor(isDarkBackgroundPage);
    
    // Cleanup function to reset background when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [isDarkBackgroundPage, setBackgroundColor]);

  return (
    <div className="min-h-screen relative">
      {/* Main Content */}
      <main className="relative">
        {/* Page Content */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
});

export default MainLayout; 