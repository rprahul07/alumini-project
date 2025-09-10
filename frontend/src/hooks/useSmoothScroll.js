import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add momentum scrolling for iOS
    document.documentElement.style.webkitOverflowScrolling = 'touch';
    
    // Optimize scroll performance
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.webkitOverflowScrolling = '';
      document.body.style.overflowX = '';
    };
  }, []);
};
