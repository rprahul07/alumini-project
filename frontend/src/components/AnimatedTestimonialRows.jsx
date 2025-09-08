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
        /* Desktop: Continuous Sliding Animation */
        <motion.div
          className="flex space-x-6"
          animate={{
            x: isPaused ? undefined : "-100%"
          }}
          transition={{
            duration: 30,
            repeat: isPaused ? 0 : Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
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
    <div className={`${variant === 'mobile' ? 'w-80 sm:w-96' : 'flex-shrink-0 w-80 sm:w-96'} bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 flex flex-col group`}>
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6 flex flex-col h-full">
        {/* Header with Photo and Name */}
        <div className="flex items-start space-x-4 mb-4 flex-shrink-0">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg group-hover:border-primary-400/50 transition-colors duration-300">
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
            {/* Animated Status Indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold font-display text-white mb-1 leading-tight group-hover:text-primary-300 transition-colors duration-300">
              {testimonial.name}
            </h3>
            <p className="text-primary-400 font-semibold text-sm mb-1 leading-tight">
              {testimonial.currentJobTitle}
            </p>
            <p className="text-secondary-400 font-medium text-sm leading-tight">
              {testimonial.companyName}
            </p>
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="relative flex-1 min-h-0 mb-4">
          <div className="h-full flex flex-col justify-center">
            <blockquote className="text-sm text-gray-200 leading-relaxed italic break-words font-body" style={{
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              "{testimonial.content.length > 200 ? testimonial.content.substring(0, 200) + '...' : testimonial.content}"
            </blockquote>
          </div>
          
          {/* Quote Icon with Enhanced Design */}
          <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
            <svg className="w-3 h-3 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
          </div>
        </div>

        {/* Enhanced Tags */}
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-400/30 backdrop-blur-sm">
            {testimonial.course}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary-500/20 text-secondary-300 border border-secondary-400/30 backdrop-blur-sm">
            {testimonial.graduationYear}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/20 backdrop-blur-sm">
            {testimonial.department}
          </span>
        </div>

        {/* Enhanced Bottom Gradient Line */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full flex-shrink-0 shadow-lg"></div>
      </div>
    </div>
  );
};

export default AnimatedTestimonialRows;
