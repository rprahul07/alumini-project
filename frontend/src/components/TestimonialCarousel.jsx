import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialCarousel = ({ testimonials, isMobile = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState(new Set());

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isPaused && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const toggleExpanded = (testimonialId) => {
    setExpandedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      return newSet;
    });
  };

  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null;
    e.target.src = fallbackSrc;
  };

  const defaultImages = {
    alumni1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
    alumni2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
    alumni3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
    alumni4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop"
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];
  const isExpanded = expandedTestimonials.has(currentTestimonial.id);
  const shouldTruncate = currentTestimonial.content.length > 300;
  const displayText = shouldTruncate && !isExpanded 
    ? currentTestimonial.content.substring(0, 300) + '...' 
    : currentTestimonial.content;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} ${isMobile ? 'h-80' : 'h-72'}`}>
              {/* Left Side - More Compact Photo and Details */}
              <div className={`${isMobile ? 'w-full p-3' : 'w-1/4 p-4'} bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center relative`}>
                {/* Subtle Background Decorations */}
                <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-lg"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-tr from-blue-200/30 to-green-200/30 rounded-full blur-md"></div>
                
                {/* Profile Photo */}
                <div className="relative z-10 mb-3">
                  <div className="relative group">
                    <img
                      src={currentTestimonial.photoUrl}
                      className={`${isMobile ? 'w-16 h-16' : 'w-18 h-18'} rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300`}
                      onError={(e) => handleImageError(e, defaultImages.alumni1)}
                      loading="lazy"
                      alt={`${currentTestimonial.name} profile`}
                    />
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Name and Details */}
                <div className="text-center z-10">
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 mb-1`}>
                    {currentTestimonial.name}
                  </h3>
                  <p className="text-green-600 font-semibold text-xs mb-0.5">
                    {currentTestimonial.currentJobTitle}
                  </p>
                  <p className="text-gray-600 text-xs mb-2">
                    {currentTestimonial.companyName}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {currentTestimonial.course}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {currentTestimonial.graduationYear}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {currentTestimonial.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - More Space for Testimonial Content */}
              <div className={`${isMobile ? 'w-full p-4' : 'w-3/4 p-6'} flex flex-col relative`}>
                {/* Quote Icon */}
                <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center z-10">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                
                {/* Testimonial Text Container - More Space */}
                <div className="flex-1 flex flex-col justify-center pl-6 pr-2 pt-1 min-h-0">
                  <div className="flex-1 flex flex-col justify-center">
                    <blockquote className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-800 leading-relaxed italic font-medium break-words overflow-hidden`} style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      "{displayText}"
                    </blockquote>
                    
                    {/* Read More/Less Button */}
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpanded(currentTestimonial.id)}
                        className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-200 flex-shrink-0"
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                  
                  {/* Bottom Decoration */}
                  <div className="mt-2 h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-green-400 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compact Navigation Controls */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center mt-6 space-x-4">
          {/* Previous Button */}
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md group"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cute Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 scale-150 shadow-sm' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md group"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Cute Auto-play Indicator */}
      {testimonials.length > 1 && !isPaused && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs">Auto</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;
