/**
 * Analytics Configuration
 * Centralized configuration for Google Analytics 4
 */

// Debug environment variables (only in development)
if (import.meta.env.DEV) {
  console.log('Environment Variables Debug:', {
    VITE_GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE
  });
}

export const ANALYTICS_CONFIG = {
  // Enable in both development and production, but only track in production
  enabled: import.meta.env.VITE_GA_MEASUREMENT_ID,
  
  // GA4 Measurement ID
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  
  // Performance settings
  debug: import.meta.env.DEV,
  
  // Privacy settings
  anonymizeIp: true,
  allowGoogleAds: false,
  
  // Performance optimizations
  sendPageView: true,
  transport: 'beacon', // Use beacon for better performance
  
  // Custom dimensions (if needed)
  customMap: {
    // Add custom dimensions here
  }
};

/**
 * Check if analytics should be loaded
 * @returns {boolean}
 */
export const shouldLoadAnalytics = () => {
  return ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.measurementId;
};

/**
 * Get analytics configuration for initialization
 * @returns {object|null}
 */
export const getAnalyticsConfig = () => {
  // Debug logging (only in development)
  if (import.meta.env.DEV) {
    console.log('Analytics Config Debug:', {
      enabled: ANALYTICS_CONFIG.enabled,
      measurementId: ANALYTICS_CONFIG.measurementId,
      shouldLoad: shouldLoadAnalytics(),
      envVar: import.meta.env.VITE_GA_MEASUREMENT_ID
    });
  }
  
  if (!shouldLoadAnalytics()) {
    if (import.meta.env.DEV) {
      console.log('Analytics not loaded - missing measurement ID or disabled');
    }
    return null;
  }
  
  return {
    measurementId: ANALYTICS_CONFIG.measurementId,
    debug: ANALYTICS_CONFIG.debug,
    anonymizeIp: ANALYTICS_CONFIG.anonymizeIp,
    allowGoogleAds: ANALYTICS_CONFIG.allowGoogleAds,
    transport: ANALYTICS_CONFIG.transport
  };
};
