// Font optimization utilities - Aggressive optimization
export const preloadFonts = () => {
  // Only preload the most essential font to reduce bundle size
  const essentialFonts = [
    {
      rel: 'preload',
      href: '/webfonts/fa-solid-900.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ];

  essentialFonts.forEach(font => {
    const link = document.createElement('link');
    Object.assign(link, font);
    document.head.appendChild(link);
  });
};

export const addFontDisplayCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Only load the most essential fonts */
    @font-face {
      font-family: 'Font Awesome 6 Free';
      font-style: normal;
      font-weight: 900;
      font-display: swap;
      src: url('/webfonts/fa-solid-900.woff2') format('woff2');
    }
    
    /* Remove all other fonts to save space */
    /* fa-brands, fa-regular, fa-v4compatibility are removed */
  `;
  document.head.appendChild(style);
};

export const loadFontsWithFallback = () => {
  // Remove all non-essential font files from DOM
  const nonEssentialFonts = document.querySelectorAll('link[href*="fa-brands"], link[href*="fa-regular"], link[href*="fa-v4compatibility"]');
  nonEssentialFonts.forEach(font => font.remove());
  
  // Also remove TTF files in favor of WOFF2
  const ttfFonts = document.querySelectorAll('link[href*=".ttf"]');
  ttfFonts.forEach(font => font.remove());
  
  // Add font-display: swap to prevent layout shifts
  const existingFontAwesome = document.querySelector('link[href*="fontawesome"]');
  if (existingFontAwesome) {
    existingFontAwesome.setAttribute('media', 'print');
    existingFontAwesome.setAttribute('onload', "this.media='all'");
  }
};

export const optimizeFontLoading = () => {
  // Implement aggressive font loading optimization
  if ('fonts' in document) {
    // Use Font Loading API for better control
    const fontLoader = new FontFace('Font Awesome 6 Free', 'url(/webfonts/fa-solid-900.woff2)');
    fontLoader.load().then(() => {
      document.fonts.add(fontLoader);
    });
  }
  
  // Remove unused font files immediately
  setTimeout(() => {
    const unusedFonts = document.querySelectorAll('link[href*="fa-brands"], link[href*="fa-regular"], link[href*="fa-v4compatibility"], link[href*=".ttf"]');
    unusedFonts.forEach(font => font.remove());
  }, 100);
};

export const removeUnusedFonts = () => {
  // Aggressively remove all non-essential fonts
  const fontsToRemove = [
    'fa-brands',
    'fa-regular', 
    'fa-v4compatibility',
    '.ttf'
  ];
  
  fontsToRemove.forEach(pattern => {
    const elements = document.querySelectorAll(`link[href*="${pattern}"]`);
    elements.forEach(el => el.remove());
  });
};
