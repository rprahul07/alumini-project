import { useEffect, useState, useCallback } from 'react';

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    setOffset(window.pageYOffset * speed);
  }, [speed]);

  useEffect(() => {
    // Use passive listeners for better performance
    let ticking = false;
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add passive listener for better performance
    window.addEventListener('scroll', throttledHandleScroll, { 
      passive: true,
      capture: false 
    });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll]);

  return offset;
};

export const useParallaxTransform = (speed = 0.5, direction = 'y') => {
  const offset = useParallax(speed);
  
  if (direction === 'x') {
    return `translate3d(${offset}px, 0, 0)`;
  }
  
  return `translate3d(0, ${offset}px, 0)`;
};
