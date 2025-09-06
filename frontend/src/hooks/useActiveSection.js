import { useState, useEffect } from 'react';

/**
 * Custom hook to track which section is currently in view
 * @param {string[]} sectionIds - Array of section IDs to observe
 * @param {number} threshold - Intersection threshold (0-1)
 * @param {string} rootMargin - Root margin for intersection observer
 * @returns {string} - Currently active section ID
 */
export const useActiveSection = (sectionIds = [], threshold = 0.3, rootMargin = '-20% 0px -20% 0px') => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observers = new Map();
    const sectionElements = new Map();

    // Create intersection observer for each section
    const createObserver = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return null;

      sectionElements.set(sectionId, element);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(element);
      return observer;
    };

    // Create observers for all sections
    sectionIds.forEach((sectionId) => {
      const observer = createObserver(sectionId);
      if (observer) {
        observers.set(sectionId, observer);
      }
    });

    // Cleanup function
    return () => {
      observers.forEach((observer) => observer.disconnect());
      observers.clear();
      sectionElements.clear();
    };
  }, [sectionIds, threshold, rootMargin]);

  return activeSection;
};

/**
 * Hook to scroll to a specific section smoothly
 * @param {string} sectionId - ID of the section to scroll to
 * @param {number} offset - Offset from top (default: 80 for navbar)
 */
export const useScrollToSection = (offset = 80) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return scrollToSection;
};
