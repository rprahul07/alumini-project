// Image preloading utility for better perceived performance
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (imageUrls) => {
  const promises = imageUrls.map(url => preloadImage(url));
  try {
    await Promise.allSettled(promises);
    console.log('Images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Preload critical event images (first few events)
export const preloadEventImages = (events, limit = 4) => {
  if (!events || events.length === 0) return;
  
  const criticalImages = events
    .slice(0, limit)
    .map(event => event.imageUrl)
    .filter(Boolean);
  
  if (criticalImages.length > 0) {
    preloadImages(criticalImages);
  }
};

// Intersection Observer for lazy loading
export const createImageObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Preload images when they come into view
export const observeImages = (imageElements, onIntersect) => {
  const observer = createImageObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });
  
  imageElements.forEach(img => observer.observe(img));
  
  return observer;
};
