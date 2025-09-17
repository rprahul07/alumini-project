import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CompactAnnouncements = ({ announcements, loading }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoScrollRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (announcements.length <= 1 || isHovered) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [announcements.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const getPriorityInfo = (order) => {
    if (order <= 1) return { color: 'text-red-500', bgColor: 'bg-red-50', dotColor: 'bg-red-500' };
    if (order <= 3) return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', dotColor: 'bg-yellow-500' };
    return { color: 'text-blue-500', bgColor: 'bg-blue-50', dotColor: 'bg-blue-500' };
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffInHours = Math.floor((now - announcementDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return '1d';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return `${Math.floor(diffInHours / 168)}w`;
  };

  if (loading) {
    return (
      <section className="py-2 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-primary-300 rounded-full"></div>
              <div className="h-2.5 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];
  const priority = getPriorityInfo(currentAnnouncement.order);

  return (
    <section 
      className="py-2 bg-gradient-to-r from-primary-50/50 via-white/80 to-secondary-50/50 border-b border-gray-100 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 rounded-full opacity-40 blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Icon and title */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">📢</span>
            </div>
            
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnouncement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2"
                >
                  {/* Priority dot */}
                  <div className={`w-1.5 h-1.5 rounded-full ${priority.dotColor} flex-shrink-0`}></div>
                  
                  {/* Title */}
                  <h3 className="text-xs font-semibold text-gray-900 truncate cursor-pointer hover:text-primary-600 transition-colors duration-200 font-sans"
                      onClick={() => navigate('/announcements')}>
                    {currentAnnouncement.title}
                  </h3>
                  
                  {/* Time */}
                  <span className="text-xs text-gray-500 font-medium flex-shrink-0 font-sans">
                    {getTimeAgo(currentAnnouncement.createdAt)}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right side - Navigation and view all */}
          <div className="flex items-center space-x-1.5 ml-3">
            {/* Navigation dots */}
            {announcements.length > 1 && (
              <div className="flex items-center space-x-1">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary-500 scale-125' 
                        : 'bg-gray-300 hover:bg-primary-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Navigation arrows */}
            {announcements.length > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrev}
                  className="w-5 h-5 bg-white/60 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-5 h-5 bg-white/60 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactAnnouncements;
