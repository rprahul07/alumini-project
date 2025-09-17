import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const MyActivityCard = memo(({ features, defaultTab }) => {
  const [mainTab, setMainTab] = useState(defaultTab || features[0]?.key);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentFeature = features.find(f => f.key === mainTab);

  // Update current index when mainTab changes
  useEffect(() => {
    const index = features.findIndex(f => f.key === mainTab);
    setCurrentIndex(index);
  }, [mainTab, features]);

  // Navigation functions
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % features.length;
    setMainTab(features[nextIndex].key);
  }, [currentIndex, features]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? features.length - 1 : currentIndex - 1;
    setMainTab(features[prevIndex].key);
  }, [currentIndex, features]);

  return (
    <section className="flex flex-col h-full min-h-[250px] sm:min-h-[280px]">
      {/* Enhanced Mobile Header */}
      <div className="flex flex-col gap-2 mb-3 flex-shrink-0">
        {/* Title and Toggle - Enhanced Design */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 font-sans">My Activity</h2>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-pulse"></div>
          </div>
          
          {/* Enhanced Mobile Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-100 backdrop-blur-sm border border-slate-200 text-slate-900 hover:bg-slate-200 transition-all duration-200 shadow-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="bg-slate-100 backdrop-blur-xl rounded-xl p-2 border border-slate-200 space-y-1">
                {features.map(feature => (
                  <motion.button
                    key={feature.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      mainTab === feature.key 
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-xl' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg'
                    }`}
                    onClick={() => {
                      setMainTab(feature.key);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{feature.label}</span>
                      {mainTab === feature.key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full flex-shrink-0 ml-2"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Desktop Tab Navigation - Main Activity Buttons */}
        <div className="hidden lg:flex gap-3 flex-wrap">
          {features.map(feature => (
            <motion.button
              key={feature.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                mainTab === feature.key 
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-xl' 
                  : 'bg-white backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:shadow-lg'
              }`}
              onClick={() => setMainTab(feature.key)}
            >
              {feature.label}
            </motion.button>
          ))}
        </div>

        {/* Enhanced Mobile Tab Pills - Main Activity Buttons */}
        {!isMobileMenuOpen && (
          <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-hide px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {features.map((feature, index) => (
              <motion.button
                key={feature.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  mainTab === feature.key 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-xl' 
                    : 'bg-white backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:shadow-lg'
                }`}
                onClick={() => setMainTab(feature.key)}
              >
                <span className="truncate max-w-[80px]">{feature.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentFeature?.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Mobile Bottom Navigation */}
      <div className="lg:hidden mt-2">
        {/* Enhanced Progress Dots */}
        <div className="flex justify-center space-x-1">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.8 }}
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                mainTab === feature.key 
                  ? 'bg-gradient-to-r from-primary-400 to-secondary-400 scale-125 shadow-lg' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              onClick={() => setMainTab(feature.key)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default MyActivityCard; 