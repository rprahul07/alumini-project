import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <section className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 pt-16 pb-12 relative overflow-hidden min-h-[80vh]">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-400/30 to-primary-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-300/20 to-secondary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/60 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full">
        <div className="flex justify-center items-center pt-8 lg:pt-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 max-w-4xl text-center"
          >
            {/* Enhanced Container with glass morphism */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10 rounded-3xl"></div>
              
              <div className="relative z-10 space-y-6">
                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                    {getMainHeading()}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base md:text-lg text-white leading-relaxed max-w-3xl font-medium font-body"
                >
                  {getSubtitle()}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl"
                >
                  {getDescription()}
                </motion.p>

                {/* Enhanced Emotional Quote */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="relative bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-2xl animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-400 to-secondary-400 rounded-full"></div>
                    <blockquote className="pl-6 italic text-base md:text-lg text-white leading-relaxed font-medium font-body">
                      "We build our dream at CUCEK, and now we return with stories of success"
                    </blockquote>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-6 pt-8 justify-center items-center"
            >
              <button
                onClick={handleCallToAction}
                className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-primary-500/25 text-base min-w-[200px]"
              >
                <span className="mr-3">{getCallToAction()}</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400/30 to-secondary-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </button>

              <button
                onClick={() => {
                  const featuresSection = document.querySelector('#features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:border-white/50 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-white/25 text-base min-w-[180px]"
              >
                <span className="mr-3">Explore Features</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </motion.svg>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </button>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default StorytellingHero;
