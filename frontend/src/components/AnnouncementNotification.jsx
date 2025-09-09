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

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

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
    }, 5000);
    setAutoHideTimer(timer);
  };

  const getPriorityInfo = (order) => {
    if (order <= 1) return { 
      color: 'from-red-500 to-red-600', 
      bgColor: 'bg-red-500/20', 
      textColor: 'text-red-300',
      dotColor: 'bg-red-500',
      borderColor: 'border-red-500/30'
    };
    if (order <= 3) return { 
      color: 'from-yellow-500 to-orange-500', 
      bgColor: 'bg-yellow-500/20', 
      textColor: 'text-yellow-300',
      dotColor: 'bg-yellow-500',
      borderColor: 'border-yellow-500/30'
    };
    return { 
      color: 'from-primary-500 to-secondary-500', 
      bgColor: 'bg-primary-500/20', 
      textColor: 'text-primary-300',
      dotColor: 'bg-primary-500',
      borderColor: 'border-primary-500/30'
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

  // Show loading animation and auto-dismiss after completion
  useEffect(() => {
    if (loading) {
      // Auto-dismiss after loading animation completes (2 seconds)
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Auto-dismiss if no announcements
  useEffect(() => {
    if (!announcements || announcements.length === 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [announcements]);

  if (!announcements || announcements.length === 0 || isDismissed) {
    return null;
  }

  // Show loading state with animation
  if (loading) {
    return (
      <AnimatePresence>
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
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-primary-500/10 rounded-2xl animate-pulse"></div>
            
            {/* Loading content */}
            <div className="p-4 relative z-10">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-400 border-t-transparent"></div>
                <span className="text-white font-medium">Loading announcements...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
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
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl hover:border-white/30 transition-all duration-300 relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-primary-500/10 rounded-2xl animate-pulse"></div>
            
            {/* Floating particles */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-primary-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-secondary-400/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            {/* Compact Header */}
            <div className="flex items-center justify-between p-3 relative z-10">
              <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                {/* Compact Icon */}
                <div className={`w-8 h-8 bg-gradient-to-r ${priority.color} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white text-sm">🔔</span>
                </div>
                
                {/* Title and Priority */}
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="font-semibold text-white text-sm truncate">New Announcement</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${priority.dotColor} flex-shrink-0 animate-pulse`}></div>
                  {announcements.length > 1 && (
                    <span className={`px-1.5 py-0.5 ${priority.bgColor} ${priority.textColor} text-xs font-medium rounded-full flex-shrink-0 border ${priority.borderColor}`}>
                      {currentIndex + 1}/{announcements.length}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-md flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Compact Content */}
            <div className="px-3 pb-2 relative z-10">
              <motion.div
                key={currentAnnouncement.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">
                  {currentAnnouncement.title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {currentAnnouncement.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{getTimeAgo(currentAnnouncement.createdAt)}</span>
                  
                  {/* Compact Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Next arrow button */}
                    {announcements.length > 1 && (
                      <button
                        onClick={handleNext}
                        className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 border border-white/20"
                        title="Next announcement"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                ? 'bg-primary-400' 
                                : 'bg-white/30'
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
            <div className="h-0.5 bg-white/10 relative z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementNotification;
