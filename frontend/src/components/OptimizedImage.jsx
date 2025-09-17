import React, { useState, useEffect, memo, useCallback, useRef } from 'react';

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName = '',
  fallbackSrc = null,
  webpSrc = null,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width = undefined,
  height = undefined,
  priority = false,
  quality = 75,
  onLoad = null,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [isInView, setIsInView] = useState(priority); // For lazy loading
  const imgRef = useRef(null);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) {
      onLoad();
    }
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

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    setSupportsWebP(checkWebPSupport());
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate optimized image URLs
  const generateOptimizedUrls = useCallback((originalSrc) => {
    if (!originalSrc) return { webp: null, fallback: null };
    
          // For Azure Blob Storage images, add optimization parameters
          if (originalSrc.includes('alumniblob.blob.core.windows.net')) {
            const url = new URL(originalSrc);
            url.searchParams.set('w', '400'); // Smaller width for faster loading
            url.searchParams.set('h', '300'); // Smaller height for faster loading
            url.searchParams.set('q', '60'); // Lower quality for faster loading
            url.searchParams.set('f', 'webp'); // Format

            return {
              webp: url.toString(),
              fallback: originalSrc
            };
          }
    
    // For other external images, return as-is
    if (originalSrc.startsWith('http')) {
      return { webp: webpSrc || originalSrc, fallback: originalSrc };
    }
    
    // For local images, generate optimized versions
    const baseUrl = originalSrc.split('?')[0];
    const params = new URLSearchParams();
    params.set('q', quality.toString());
    params.set('fit', 'max');
    
    return {
      webp: `${baseUrl}?${params.toString()}&format=webp`,
      fallback: `${baseUrl}?${params.toString()}`
    };
  }, [quality, webpSrc]);

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Show error state
  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-primary-400 ${className}`} {...props}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  }

  const optimizedUrls = generateOptimizedUrls(imageSrc);
  const finalWebPSrc = supportsWebP ? optimizedUrls.webp : null;
  const finalFallbackSrc = optimizedUrls.fallback || imageSrc;

  return (
    <div className={`relative w-full h-full ${wrapperClassName}`} ref={imgRef}>
      {isInView ? (
        <picture>
          {/* WebP format for modern browsers */}
          {finalWebPSrc && (
            <source srcSet={finalWebPSrc} type="image/webp" />
          )}
          
          {/* Fallback image */}
          <img
            src={finalFallbackSrc}
            alt={alt}
            className={`block transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            loading={priority ? 'eager' : loading}
            sizes={sizes}
            decoding="async"
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      ) : (
        <div className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 animate-pulse rounded-full"></div>
      )}
    </div>
  );
});

export default OptimizedImage;
