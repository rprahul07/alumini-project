import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Performance optimizations - only in production
if (import.meta.env.PROD) {
  // Lazy load optimization utilities
  Promise.all([
    import('./utils/fontOptimization'),
    import('./utils/performanceMonitor')
  ]).then(([fontOpt, perfMon]) => {
    fontOpt.preloadFonts();
    fontOpt.addFontDisplayCSS();
    fontOpt.removeUnusedFonts();
    perfMon.initPerformanceMonitoring();
    perfMon.measurePageLoad();
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);
