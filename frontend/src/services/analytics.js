/**
 * Google Analytics 4 Service
 * Lightweight, performance-optimized analytics service
 */

import { getAnalyticsConfig, shouldLoadAnalytics } from '../utils/analyticsConfig';

class AnalyticsService {
  constructor() {
    this.ga = null;
    this.isInitialized = false;
    this.isLoading = false;
    this.pendingEvents = [];
    this.config = getAnalyticsConfig();
    
    // Debug logging (can be removed in production)
    if (import.meta.env.DEV) {
      console.log('Analytics Service Constructor:', {
        hasConfig: !!this.config,
        measurementId: this.config?.measurementId,
        envVar: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
    }
  }

  /**
   * Initialize Google Analytics 4
   * Lazy-loaded for optimal performance
   */
  async initialize() {
    // Don't initialize if already done or not needed
    if (this.isInitialized || this.isLoading) {
      console.log('Analytics already initialized or loading');
      return;
    }

    // If no config, mark as initialized but don't load analytics
    if (!this.config) {
      this.isInitialized = true;
      console.log('Analytics not configured - running in mock mode');
      return;
    }

    if (import.meta.env.DEV) {
      console.log('Starting analytics initialization with config:', this.config);
    }
    this.isLoading = true;

    try {
      // Dynamic import for better code splitting
      const ReactGA = await import('react-ga4');
      
      // react-ga4 v2+ exports default as the main object
      const ReactGAInstance = ReactGA.default || ReactGA;
      
      // Initialize GA4 using the correct method
      ReactGAInstance.initialize(this.config.measurementId, {
        debug: this.config.debug,
        anonymizeIp: this.config.anonymizeIp,
        allowGoogleAds: this.config.allowGoogleAds,
        transport: this.config.transport
      });

      // Store the ReactGA instance for tracking
      this.ga = ReactGAInstance;

      this.isInitialized = true;
      this.isLoading = false;

      // Process any pending events
      this.processPendingEvents();

      if (import.meta.env.DEV) {
        console.log('Analytics initialized successfully with GA instance:', !!this.ga);
      }
    } catch (error) {
      console.error('Analytics initialization failed:', error);
      this.isLoading = false;
      this.isInitialized = true; // Mark as initialized to prevent retries
    }
  }

  /**
   * Process events that were queued before initialization
   */
  processPendingEvents() {
    if (this.pendingEvents.length > 0) {
      this.pendingEvents.forEach(event => {
        switch (event.type) {
          case 'pageView':
            this.trackPageView(event.pagePath, event.pageTitle);
            break;
          case 'event':
            this.trackEvent(event.action, event.category, event.label, event.value);
            break;
          case 'engagement':
            this.trackEngagement(event.engagementType, event.parameters);
            break;
          case 'conversion':
            this.trackConversion(event.conversionType, event.parameters);
            break;
          case 'userProperties':
            this.setUserProperties(event.properties);
            break;
        }
      });
      this.pendingEvents = [];
    }
  }

  /**
   * Track page view
   * @param {string} pagePath - The page path
   * @param {string} pageTitle - The page title
   */
  trackPageView(pagePath, pageTitle) {
    if (!this.isInitialized) {
      this.pendingEvents.push({ type: 'pageView', pagePath, pageTitle });
      return;
    }

    if (!this.ga) {
      console.log('Analytics not available - page view not tracked:', pagePath);
      return;
    }

    try {
      // Use ReactGA.send for page views
      this.ga.send({ hitType: 'pageview', page: pagePath, title: pageTitle });
      console.log('Page view tracked:', pagePath, pageTitle);
    } catch (error) {
      console.warn('Page view tracking failed:', error);
    }
  }

  /**
   * Track custom event
   * @param {string} action - Event action
   * @param {string} category - Event category
   * @param {string} label - Event label
   * @param {number} value - Event value
   */
  trackEvent(action, category, label, value) {
    if (!this.isInitialized) {
      // Queue event for later processing
      this.pendingEvents.push({ type: 'event', action, category, label, value });
      return;
    }

    if (!this.ga) {
      console.log('Analytics not available - event not tracked:', action);
      return;
    }

    try {
      // Use ReactGA.event for custom events
      this.ga.event({
        action: action,
        category: category,
        label: label,
        value: value
      });
      console.log('Event tracked:', action, category, label, value);
    } catch (error) {
      console.warn('Event tracking failed:', error);
    }
  }

  /**
   * Track user engagement
   * @param {string} engagementType - Type of engagement
   * @param {object} parameters - Additional parameters
   */
  trackEngagement(engagementType, parameters = {}) {
    if (!this.isInitialized) {
      this.pendingEvents.push({ type: 'engagement', engagementType, parameters });
      return;
    }

    if (!this.ga) {
      console.log('Analytics not available - engagement not tracked:', engagementType);
      return;
    }

    try {
      this.ga.event({
        action: engagementType,
        category: 'engagement',
        ...parameters
      });
      console.log('Engagement tracked:', engagementType, parameters);
    } catch (error) {
      console.warn('Engagement tracking failed:', error);
    }
  }

  /**
   * Track conversion
   * @param {string} conversionType - Type of conversion
   * @param {object} parameters - Additional parameters
   */
  trackConversion(conversionType, parameters = {}) {
    if (!this.isInitialized) {
      this.pendingEvents.push({ type: 'conversion', conversionType, parameters });
      return;
    }

    if (!this.ga) {
      console.log('Analytics not available - conversion not tracked:', conversionType);
      return;
    }

    try {
      this.ga.event({
        action: conversionType,
        category: 'conversion',
        ...parameters
      });
      console.log('Conversion tracked:', conversionType, parameters);
    } catch (error) {
      console.warn('Conversion tracking failed:', error);
    }
  }

  /**
   * Set user properties
   * @param {object} properties - User properties
   */
  setUserProperties(properties) {
    if (!this.isInitialized) {
      this.pendingEvents.push({ type: 'userProperties', properties });
      return;
    }

    if (!this.ga) {
      console.log('Analytics not available - user properties not set');
      return;
    }

    try {
      // ReactGA v4 uses set for user properties
      this.ga.set(properties);
      console.log('User properties set:', properties);
    } catch (error) {
      console.warn('User properties setting failed:', error);
    }
  }

  /**
   * Check if analytics is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.isInitialized && this.ga !== null;
  }

  /**
   * Get analytics instance
   * @returns {object|null}
   */
  getInstance() {
    return this.ga;
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

// Export the service
export default analytics;

// Export individual methods for convenience
export const {
  initialize: initAnalytics,
  trackPageView,
  trackEvent,
  trackEngagement,
  trackConversion,
  setUserProperties,
  isAvailable: isAnalyticsAvailable
} = analytics;
