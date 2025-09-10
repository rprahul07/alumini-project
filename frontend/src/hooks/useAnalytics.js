/**
 * useAnalytics Hook
 * Custom hook for easy analytics tracking with performance optimizations
 */

import { useCallback, useEffect, useRef } from 'react';
import analytics from '../services/analytics';

/**
 * Custom hook for analytics tracking
 * @returns {object} Analytics methods and state
 */
export const useAnalytics = () => {
  const isInitialized = useRef(false);

  // Initialize analytics on first use
  useEffect(() => {
    if (!isInitialized.current) {
      analytics.initialize();
      isInitialized.current = true;
    }
  }, []);

  // Track page view
  const trackPage = useCallback((pagePath, pageTitle) => {
    analytics.trackPageView(pagePath, pageTitle);
  }, []);

  // Track custom event
  const trackEvent = useCallback((action, category, label, value) => {
    analytics.trackEvent(action, category, label, value);
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((engagementType, parameters) => {
    analytics.trackEngagement(engagementType, parameters);
  }, []);

  // Track conversion
  const trackConversion = useCallback((conversionType, parameters) => {
    analytics.trackConversion(conversionType, parameters);
  }, []);

  // Set user properties
  const setUserProperties = useCallback((properties) => {
    analytics.setUserProperties(properties);
  }, []);

  // Check if analytics is available
  const isAvailable = useCallback(() => {
    return analytics.isAvailable();
  }, []);

  return {
    trackPage,
    trackEvent,
    trackEngagement,
    trackConversion,
    setUserProperties,
    isAvailable: isAvailable()
  };
};

/**
 * Hook for tracking specific user interactions
 * @param {string} category - Event category
 * @returns {object} Interaction tracking methods
 */
export const useInteractionTracking = (category = 'user_interaction') => {
  const { trackEvent } = useAnalytics();

  const trackClick = useCallback((element, label) => {
    trackEvent('click', category, label);
  }, [trackEvent, category]);

  const trackHover = useCallback((element, label) => {
    trackEvent('hover', category, label);
  }, [trackEvent, category]);

  const trackFocus = useCallback((element, label) => {
    trackEvent('focus', category, label);
  }, [trackEvent, category]);

  const trackSubmit = useCallback((form, label) => {
    trackEvent('submit', category, label);
  }, [trackEvent, category]);

  const trackDownload = useCallback((file, label) => {
    trackEvent('download', category, label);
  }, [trackEvent, category]);

  const trackShare = useCallback((content, platform) => {
    trackEvent('share', category, `${content}_${platform}`);
  }, [trackEvent, category]);

  return {
    trackClick,
    trackHover,
    trackFocus,
    trackSubmit,
    trackDownload,
    trackShare
  };
};

/**
 * Hook for tracking page performance
 * @returns {object} Performance tracking methods
 */
export const usePerformanceTracking = () => {
  const { trackEvent } = useAnalytics();

  const trackPageLoad = useCallback((loadTime) => {
    trackEvent('page_load', 'performance', 'load_time', Math.round(loadTime));
  }, [trackEvent]);

  const trackPageInteraction = useCallback((interactionTime) => {
    trackEvent('page_interaction', 'performance', 'interaction_time', Math.round(interactionTime));
  }, [trackEvent]);

  const trackResourceLoad = useCallback((resourceType, loadTime) => {
    trackEvent('resource_load', 'performance', resourceType, Math.round(loadTime));
  }, [trackEvent]);

  return {
    trackPageLoad,
    trackPageInteraction,
    trackResourceLoad
  };
};

export default useAnalytics;
