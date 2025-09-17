import React from 'react';
import { motion } from 'framer-motion';
import { useActiveSection, useScrollToSection } from '../hooks/useActiveSection';

const SectionProgress = ({ sections = [], className = '' }) => {
  const activeSection = useActiveSection(sections.map(s => s.id));
  const scrollToSection = useScrollToSection(80);

  const handleSectionClick = (sectionId) => {
    scrollToSection(sectionId);
  };

  if (sections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Progress line */}
        <div className="w-1 h-32 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"
            initial={{ height: 0 }}
            animate={{
              height: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Section dots */}
        <div className="flex flex-col space-y-6">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`group relative flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                whileHover={{ opacity: 1, x: 0, scale: 1 }}
                className="absolute right-6 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
              >
                {section.label}
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
              </motion.div>

              {/* Active indicator */}
              {activeSection === section.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Pulse effect for active section */}
              {activeSection === section.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="text-xs text-gray-500 font-medium">
          {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
        </div>
      </div>
    </motion.div>
  );
};

export default SectionProgress;
