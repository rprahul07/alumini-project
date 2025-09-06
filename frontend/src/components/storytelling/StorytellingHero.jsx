import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InteractiveTimeline from './InteractiveTimeline';
import FloatingCampusImage from './FloatingCampusImage';

const StorytellingHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome message after initial load
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 1000);
    return () => clearTimeout(timer);
  }, []);


  const getMainHeading = () => {
    if (user) {
      return `Back to where it all began, ${user.fullName || 'Alumni'}...`;
    }
    return 'Back to where it all began...';
  };

  const getSubtitle = () => {
    if (user) {
      return 'Together Again at CUCEK';
    }
    return 'Together Again at CUCEK';
  };

  const getDescription = () => {
    if (user) {
      return 'Relive. Reconnect. Remember.';
    }
    return 'Relive. Reconnect. Remember.';
  };

  const getCallToAction = () => {
    if (user) {
      return 'Reconnect Now';
    }
    return 'Join Our Community';
  };

  const handleCallToAction = () => {
    if (user) {
      // Navigate to user's dashboard or network page
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/role-selection');
    }
  };


  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-16 relative overflow-hidden min-h-screen">
      {/* Clean background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/30"></div>
      
      {/* Single floating orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start pt-8 lg:pt-12">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {getMainHeading()}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl font-medium"
            >
              {getSubtitle()}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl"
            >
              {getDescription()}
            </motion.p>

            {/* Emotional Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-400 to-blue-400 rounded-full"></div>
              <blockquote className="pl-6 italic text-sm sm:text-base text-gray-600 leading-relaxed">
                "We build our dream at CUCEK, and now we return with stories of success"
              </blockquote>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <button
                onClick={handleCallToAction}
                className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                <span className="mr-2">{getCallToAction()}</span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </button>

              <button
                onClick={() => {
                  const timelineSection = document.querySelector('#timeline');
                  if (timelineSection) {
                    timelineSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative inline-flex items-center justify-center px-5 py-3 bg-white text-green-600 font-semibold rounded-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
              >
                <span className="mr-2">Discover Stories</span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </motion.svg>
              </button>
            </motion.div>

          </motion.div>

          {/* Right Side - Interactive Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center xl:justify-end order-first xl:order-last"
          >
            <div className="relative w-full max-w-4xl xl:max-w-3xl">
              {/* Interactive Timeline */}
              <InteractiveTimeline />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingHero;
