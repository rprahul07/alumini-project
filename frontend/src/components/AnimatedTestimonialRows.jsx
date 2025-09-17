import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedTestimonialRows = ({ testimonials }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null;
    e.target.src = fallbackSrc;
  };

  const handleTouchStart = () => {
    setIsPaused(true);
    // Clear any existing timeout
    if (touchTimeout) {
      clearTimeout(touchTimeout);
    }
  };

  const handleTouchEnd = () => {
    // Set a timeout to resume animation after touch ends
    const timeout = setTimeout(() => {
      setIsPaused(false);
    }, 2000); // Resume after 2 seconds
    setTouchTimeout(timeout);
  };

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Mobile card cycling
  useEffect(() => {
    if (isMobile && !isPaused && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentCardIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // 4 seconds interval for better readability

      return () => clearInterval(interval);
    }
  }, [isMobile, isPaused, testimonials.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
    };
  }, [touchTimeout]);

const defaultImages = {
  // Placeholder avatar for users without profile photos
  placeholderAvatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1IDQ1QzE1IDM3LjI2ODcgMjEuMjY4NyAzMSAzMCAzMUMzOC43MzEzIDMxIDQ1IDM3LjI2ODcgNDUgNDVWNDdIMTVWNDVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo="
};

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative overflow-hidden py-4"
      onMouseEnter={() => !isMobile && setIsPaused(true)}
      onMouseLeave={() => !isMobile && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isMobile ? (
        /* Mobile: Single Card Animation */
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <TestimonialCard
                testimonial={testimonials[currentCardIndex]}
                handleImageError={handleImageError}
                defaultImages={defaultImages}
                variant="mobile"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Desktop: Simplified Full-Width Animation */
        <div className="w-screen relative -ml-4 -mr-4 sm:-ml-6 sm:-mr-6 lg:-ml-8 lg:-mr-8 xl:-ml-12 xl:-mr-12 2xl:-ml-16 2xl:-mr-16">
          <motion.div
            className="flex space-x-6"
            animate={{
              x: isPaused ? undefined : [0, -100 * testimonials.length]
            }}
            transition={{
              duration: 35,
              repeat: isPaused ? 0 : Infinity,
              ease: "linear",
              repeatType: "loop"
            }}
            style={{ width: `${duplicatedTestimonials.length * 320}px` }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`single-${testimonial.id}-${index}`}
                testimonial={testimonial}
                handleImageError={handleImageError}
                defaultImages={defaultImages}
                variant="single"
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Pause Indicator - Only show on desktop */}
      {isPaused && !isMobile && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-xs">Paused</span>
          </div>
        </div>
      )}

      {/* Mobile Card Indicator */}
      {isMobile && testimonials.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCardIndex 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 scale-125' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TestimonialCard = ({ testimonial, handleImageError, defaultImages, variant }) => {
  return (
    <div className={`${variant === 'mobile' ? 'w-72 sm:w-80' : 'flex-shrink-0 w-72 sm:w-80 lg:w-80'} bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col group`} style={{
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    }}>
      <div className="p-5 flex flex-col h-full space-y-3">
        {/* Header with Photo and Name */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200/50 shadow-md group-hover:border-primary-300 transition-colors duration-300" style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <img
                src={(testimonial.photoUrl && testimonial.photoUrl.trim() !== '') 
                  ? testimonial.photoUrl 
                  : defaultImages.placeholderAvatar}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, defaultImages.placeholderAvatar)}
                loading="lazy"
                alt={`${testimonial.name} profile`}
              />
            </div>
            {/* Enhanced Online Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-secondary-500 to-success-500 rounded-full border-2 border-white shadow-md" style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors duration-300 font-sans">
              {testimonial.name}
            </h3>
            <p className="text-xs font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-sans tracking-wide">
              {testimonial.currentJobTitle}
            </p>
            <p className="text-slate-500 text-xs font-sans">
              {testimonial.companyName}
            </p>
          </div>
        </div>

        {/* Testimonial Content - Enhanced */}
        <div className="flex-1">
          <blockquote className="text-xs text-slate-700 leading-relaxed italic font-sans">
            "{testimonial.content.length > 120 ? testimonial.content.substring(0, 120) + '...' : testimonial.content}"
          </blockquote>
        </div>

        {/* Enhanced Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-sans">
            {testimonial.course}
          </span>
          <span className="text-xs font-semibold bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent font-sans">
            {testimonial.graduationYear}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonialRows;
