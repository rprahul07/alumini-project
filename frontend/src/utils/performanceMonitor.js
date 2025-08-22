// Performance monitoring utilities
export const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      
      // Send to analytics if needed
      if (lastEntry.startTime > 2500) {
        console.warn('LCP is slow:', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
        
        if (entry.processingStart - entry.startTime > 100) {
          console.warn('FID is slow:', entry.processingStart - entry.startTime);
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
      console.log('CLS:', clsValue);
      
      if (clsValue > 0.1) {
        console.warn('CLS is poor:', clsValue);
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
