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
  }

  /**
   * Initialize Google Analytics 4
   * Lazy-loaded for optimal performance
   */
  async initialize() {
    // Don't initialize if already done or not needed
    if (this.isInitialized || this.isLoading) {
      return;
    }

    // If no config, mark as initialized but don't load analytics
    if (!this.config) {
      this.isInitialized = true;
      console.log('Analytics not configured - running in mock mode');
      return;
    }

    this.isLoading = true;

    try {
      // Dynamic import for better code splitting
      const { initialize, gtag } = await import('react-ga4');
      
      // Initialize GA4
      initialize(this.config.measurementId, {
        debug: this.config.debug,
        anonymizeIp: this.config.anonymizeIp,
        allowGoogleAds: this.config.allowGoogleAds,
        transport: this.config.transport
      });

      this.ga = { initialize, gtag };
      this.isInitialized = true;
      this.isLoading = false;

      // Process any pending events
      this.processPendingEvents();

      console.log('Analytics initialized successfully');
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
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
      this.ga.gtag('config', this.config.measurementId, {
        page_path: pagePath,
        page_title: pageTitle
      });
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
      this.ga.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
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
      this.ga.gtag('event', engagementType, {
        ...parameters,
        event_category: 'engagement'
      });
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
      this.ga.gtag('event', conversionType, {
        ...parameters,
        event_category: 'conversion'
      });
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
      this.ga.gtag('config', this.config.measurementId, {
        user_properties: properties
      });
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
