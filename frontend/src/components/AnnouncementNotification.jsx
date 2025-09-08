import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnnouncementNotification = ({ announcements, loading }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState(null);

  // Auto-advance through announcements
  useEffect(() => {
    if (announcements.length <= 1 || isDismissed) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [announcements.length, isDismissed]);

  // Auto-hide notification after 10 seconds
  useEffect(() => {
    if (isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    setAutoHideTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentIndex, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
    // Reset auto-hide timer when manually advancing
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
    }
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    setAutoHideTimer(timer);
  };

  const getPriorityInfo = (order) => {
    if (order <= 1) return { 
      color: 'from-red-500 to-red-600', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-700',
      dotColor: 'bg-red-500'
    };
    if (order <= 3) return { 
      color: 'from-yellow-500 to-orange-500', 
      bgColor: 'bg-yellow-50', 
      textColor: 'text-yellow-700',
      dotColor: 'bg-yellow-500'
    };
    return { 
      color: 'from-blue-500 to-blue-600', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-700',
      dotColor: 'bg-blue-500'
    };
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffInHours = Math.floor((now - announcementDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (loading || !announcements || announcements.length === 0 || isDismissed) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];
  const priority = getPriorityInfo(currentAnnouncement.order);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 320, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 320, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.4 
          }}
          className="fixed top-4 right-4 z-50 max-w-xs w-full"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Compact Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                {/* Compact Icon */}
                <div className={`w-8 h-8 bg-gradient-to-r ${priority.color} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                  <span className="text-white text-sm">🔔</span>
                </div>
                
                {/* Title and Priority */}
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 text-sm truncate">New Announcement</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${priority.dotColor} flex-shrink-0`}></div>
                  {announcements.length > 1 && (
                    <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full flex-shrink-0">
                      {currentIndex + 1}/{announcements.length}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-md flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Compact Content */}
            <div className="px-3 pb-2">
              <motion.div
                key={currentAnnouncement.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {currentAnnouncement.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {currentAnnouncement.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{getTimeAgo(currentAnnouncement.createdAt)}</span>
                  
                  {/* Compact Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Next arrow button */}
                    {announcements.length > 1 && (
                      <button
                        onClick={handleNext}
                        className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                        title="Next announcement"
                      >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Progress indicator */}
                    {announcements.length > 1 && (
                      <div className="flex space-x-1">
                        {announcements.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${
                              index === currentIndex 
                                ? 'bg-primary-500' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sleek Progress bar */}
            <div className="h-0.5 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementNotification;
