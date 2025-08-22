import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc, 
  sizes = "100vw",
  priority = false,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (src !== imageSrc) {
      setImageSrc(src);
      setError(false);
      setIsLoaded(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && !error) {
      setImageSrc(fallbackSrc);
      setError(true);
    }
  };

  // Special handling for Thirike image - use extremely aggressive compression
  const isThirikeImage = src && src.includes('Thirike');
  
  // Generate responsive srcSet for different screen sizes with aggressive compression
  const generateSrcSet = (originalSrc) => {
    if (!originalSrc || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // For local images, generate different sizes with extremely aggressive compression
    const sizes = [320, 480, 640, 768, 1024, 1280];
    const quality = isThirikeImage ? 50 : 70; // Extremely aggressive for Thirike
    return sizes
      .map(size => `${originalSrc}?w=${size}&q=${quality}&fit=max&compress=true ${size}w`)
      .join(', ');
  };

  // Generate WebP srcSet if supported with aggressive compression
  const generateWebPSrcSet = (originalSrc) => {
    if (!originalSrc || originalSrc.startsWith('http')) {
      return null;
    }
    
    const sizes = [320, 480, 640, 768, 1024, 1280];
    const quality = isThirikeImage ? 45 : 65; // Extremely aggressive for Thirike
    return sizes
      .map(size => `${originalSrc}?w=${size}&format=webp&q=${quality}&fit=max&compress=true ${size}w`)
      .join(', ');
  };

  // Generate AVIF srcSet for modern browsers with aggressive compression
  const generateAVIFSrcSet = (originalSrc) => {
    if (!originalSrc || originalSrc.startsWith('http')) {
      return null;
    }
    
    const sizes = [320, 480, 640, 768, 1024, 1280];
    const quality = isThirikeImage ? 40 : 60; // Extremely aggressive for Thirike
    return sizes
      .map(size => `${originalSrc}?w=${size}&format=avif&q=${quality}&fit=max&compress=true ${size}w`)
      .join(', ');
  };

  // Generate JPEG srcSet as fallback with aggressive compression
  const generateJPEGSrcSet = (originalSrc) => {
    if (!originalSrc || originalSrc.startsWith('http')) {
      return null;
    }
    
    const sizes = [320, 480, 640, 768, 1024, 1280];
    const quality = isThirikeImage ? 45 : 60; // Extremely aggressive for Thirike
    return sizes
      .map(size => `${originalSrc}?w=${size}&format=jpeg&q=${quality}&fit=max&compress=true ${size}w`)
      .join(', ');
  };

  const webPSrcSet = generateWebPSrcSet(src);
  const avifSrcSet = generateAVIFSrcSet(src);
  const jpegSrcSet = generateJPEGSrcSet(src);
  const srcSet = generateSrcSet(src);

  return (
    <picture>
      {/* AVIF format for modern browsers (best compression) */}
      {avifSrcSet && (
        <source
          type="image/avif"
          srcSet={avifSrcSet}
          sizes={sizes}
        />
      )}
      
      {/* WebP format for modern browsers */}
      {webPSrcSet && (
        <source
          type="image/webp"
          srcSet={webPSrcSet}
          sizes={sizes}
        />
      )}
      
      {/* JPEG format as fallback with compression */}
      {jpegSrcSet && (
        <source
          type="image/jpeg"
          srcSet={jpegSrcSet}
          sizes={sizes}
        />
      )}
      
      {/* Fallback image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        srcSet={srcSet}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !error && (
        <div className={`${className} bg-gray-200 animate-pulse rounded-lg`} />
      )}
    </picture>
  );
};

export default OptimizedImage;
