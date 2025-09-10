// ✅ Cleaned & Optimized - Layout without Navbar
import React, { useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

const MainLayout = memo(() => {
  const location = useLocation();
  
  // Initialize smooth scrolling
  useSmoothScroll();
  
  // Detect if on a page with dark background
  const isDarkBackgroundPage = ['/events', '/jobs', '/alumni', '/students'].includes(location.pathname);
  
  // Set background color with smooth transition
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Add transition class for smooth color change
    body.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    html.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (isDarkBackgroundPage) {
      body.style.backgroundColor = '#0f172a'; // slate-900
      html.style.backgroundColor = '#0f172a';
    } else {
      body.style.backgroundColor = '#f9fafb'; // gray-50
      html.style.backgroundColor = '#f9fafb';
    }
    
    // Cleanup function
    return () => {
      body.style.transition = '';
      html.style.transition = '';
    };
  }, [isDarkBackgroundPage]);

  return (
    <div className="min-h-screen relative">
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1] // Custom easing for smoother feel
            }}
            className="relative z-10 framer-motion-container"
            onAnimationStart={() => {
              // Ensure we're at the top when animation starts
              window.scrollTo(0, 0);
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
});

export default MainLayout; 