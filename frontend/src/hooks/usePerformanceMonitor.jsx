import { useEffect, useState, useCallback } from 'react';

const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const [isSupported, setIsSupported] = useState(false);

  // Check if Performance Observer is supported
  useEffect(() => {
    setIsSupported(
      'PerformanceObserver' in window &&
      'PerformanceEntry' in window
    );
  }, []);

  // Measure First Contentful Paint (FCP)
  const measureFCP = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }, [isSupported]);

  // Measure Largest Contentful Paint (LCP)
  const measureLCP = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1];
      
      if (lcpEntry) {
        setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime }));
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }, [isSupported]);

  // Measure First Input Delay (FID)
  const measureFID = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[0];
      
      if (fidEntry) {
        setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }, [isSupported]);

  // Measure Cumulative Layout Shift (CLS)
  const measureCLS = useCallback(() => {
    if (!isSupported) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }, [isSupported]);

  // Measure Time to First Byte (TTFB)
  const measureTTFB = useCallback(() => {
    if (!isSupported) return;

    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }
  }, [isSupported]);

  // Initialize all measurements
  useEffect(() => {
    if (!isSupported) return;

    // Measure TTFB immediately
    measureTTFB();

    // Measure FCP and LCP
    measureFCP();
    measureLCP();

    // Measure FID and CLS
    measureFID();
    measureCLS();

    // Cleanup function
    return () => {
      // PerformanceObserver automatically disconnects when component unmounts
    };
  }, [isSupported, measureFCP, measureLCP, measureFID, measureCLS, measureTTFB]);

  // Get performance score based on metrics
  const getPerformanceScore = useCallback(() => {
    let score = 100;

    // FCP scoring (0-2.5s = 100, 2.5-4s = 90, 4s+ = 50)
    if (metrics.fcp > 4000) score -= 50;
    else if (metrics.fcp > 2500) score -= 10;

    // LCP scoring (0-2.5s = 100, 2.5-4s = 90, 4s+ = 50)
    if (metrics.lcp > 4000) score -= 50;
    else if (metrics.lcp > 2500) score -= 10;

    // CLS scoring (0-0.1 = 100, 0.1-0.25 = 90, 0.25+ = 50)
    if (metrics.cls > 0.25) score -= 50;
    else if (metrics.cls > 0.1) score -= 10;

    return Math.max(0, score);
  }, [metrics]);

  // Log performance data to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.values(metrics).some(v => v !== null)) {
      console.log('🚀 Performance Metrics:', {
        FCP: metrics.fcp ? `${(metrics.fcp / 1000).toFixed(2)}s` : 'N/A',
        LCP: metrics.lcp ? `${(metrics.lcp / 1000).toFixed(2)}s` : 'N/A',
        FID: metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A',
        CLS: metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
        TTFB: metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A',
        Score: getPerformanceScore()
      });
    }
  }, [metrics, getPerformanceScore]);

  return {
    metrics,
    isSupported,
    getPerformanceScore,
    // Helper functions for manual measurement
    measureFCP,
    measureLCP,
    measureFID,
    measureCLS,
    measureTTFB,
  };
};

export default usePerformanceMonitor;
