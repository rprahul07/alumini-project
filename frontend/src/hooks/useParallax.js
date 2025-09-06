import { useEffect, useState } from 'react';

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    // Throttle scroll events for better performance
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

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [speed]);

  return offset;
};

export const useParallaxTransform = (speed = 0.5, direction = 'y') => {
  const offset = useParallax(speed);
  
  if (direction === 'x') {
    return `translateX(${offset}px)`;
  }
  
  return `translateY(${offset}px)`;
};
