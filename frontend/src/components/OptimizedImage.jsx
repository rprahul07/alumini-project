import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  webpSrc = null,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  // Handle image load error
  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Show error state
  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-500 ${className}`} {...props}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} {...props}>
      <picture>
        {/* WebP format for modern browsers */}
        {webpSrc && (
          <source srcSet={webpSrc} type="image/webp" />
        )}
        
        {/* Fallback image */}
        <img
          src={imageSrc}
          alt={alt}
          className={`block w-full h-auto transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={loading}
          sizes={sizes}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
    </div>
  );
};

export default OptimizedImage;
