// Performance monitoring utilities
export const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      // Send to analytics if needed
      if (lastEntry.startTime > 2500) {
        // LCP is slow - could send to analytics
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.processingStart - entry.startTime > 100) {
          // FID is slow - could send to analytics
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      if (clsValue > 0.1) {
        // CLS is poor - could send to analytics
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  // Monitor resource loading
  const resourceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      if (entry.initiatorType === 'img' && entry.duration > 3000) {
        console.warn('Slow image load:', entry.name, entry.duration);
      }
    });
  });
  resourceObserver.observe({ entryTypes: ['resource'] });
};

export const measurePageLoad = () => {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart);
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
    }
  });
};

export const trackUserInteraction = (element, action) => {
  const startTime = performance.now();
  
  element.addEventListener('click', () => {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    if (responseTime > 100) {
      console.warn('Slow interaction response:', action, responseTime);
    }
  });
};
