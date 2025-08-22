// Image optimization utilities
export const generateImageSrcSet = (basePath, sizes = [320, 640, 768, 1024, 1280]) => {
  return sizes
    .map(size => `${basePath}?w=${size}&q=70&fit=max ${size}w`)
    .join(', ');
};

export const generateWebPSrcSet = (basePath, sizes = [320, 640, 768, 1024, 1280]) => {
  return sizes
    .map(size => `${basePath}?w=${size}&format=webp&q=65&fit=max ${size}w`)
    .join(', ');
};

export const getOptimalImageSize = (containerWidth, devicePixelRatio = 1) => {
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  const targetSize = containerWidth * devicePixelRatio;
  
  // Find the smallest size that's >= target size
  const optimalSize = sizes.find(size => size >= targetSize);
  return optimalSize || sizes[sizes.length - 1];
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const generateBlurHash = async (imageUrl) => {
  // This would typically use a library like blurhash
  // For now, return a placeholder
  return 'L5H2EC=PM+yV0g-mq.wG9c001J?I';
};

// Special handling for large images like Thirike.jpg
export const getCompressedImageUrl = (originalSrc, targetSize = 'medium') => {
  if (!originalSrc) return originalSrc;
  
  const isThirikeImage = originalSrc.includes('Thirike');
  
  if (isThirikeImage) {
    // For Thirike image, use extremely aggressive compression
    const compressionMap = {
      small: '?w=320&q=40&format=webp&fit=max&compress=true',
      medium: '?w=640&q=45&format=webp&fit=max&compress=true',
      large: '?w=1024&q=50&format=webp&fit=max&compress=true'
    };
    
    return `${originalSrc}${compressionMap[targetSize] || compressionMap.medium}`;
  }
  
  // For other images, use standard compression
  const compressionMap = {
    small: '?w=320&q=70&fit=max',
    medium: '?w=640&q=75&fit=max',
    large: '?w=1024&q=80&fit=max'
  };
  
  return `${originalSrc}${compressionMap[targetSize] || compressionMap.medium}`;
};

// Generate multiple compressed versions for responsive loading
export const generateResponsiveImageUrls = (originalSrc) => {
  if (!originalSrc) return {};
  
  const isThirikeImage = originalSrc.includes('Thirike');
  const baseQuality = isThirikeImage ? 40 : 70;
  
  return {
    small: `${originalSrc}?w=320&q=${baseQuality}&format=webp&fit=max`,
    medium: `${originalSrc}?w=640&q=${baseQuality + 5}&format=webp&fit=max`,
    large: `${originalSrc}?w=1024&q=${baseQuality + 10}&format=webp&fit=max`,
    xlarge: `${originalSrc}?w=1280&q=${baseQuality + 15}&format=webp&fit=max`
  };
};
