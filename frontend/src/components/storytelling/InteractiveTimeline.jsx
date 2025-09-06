import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const InteractiveTimeline = () => {
  const { user } = useAuth();
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isPlaying] = useState(true);

  // Timeline data based on user status
  const getTimelineData = () => {
    if (user) {
      return [
        {
          id: 'walked-out',
          title: 'We Walked Out with Dreams',
          year: user.graduationYear || '2022',
          description: 'Carrying hopes, friendships, and the courage CUCEK gave us.',
          icon: '🌱',
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'built-paths',
          title: 'We Built Our Paths',
          year: 'Present',
          description: 'With every step forward, the lessons of CUCEK shaped our success.',
          icon: '🌳',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'come-home',
          title: 'We Come Back Home',
          year: 'Now',
          description: 'Not just to remember, but to give, to guide, and to belong once again.',
          icon: '🏡',
          color: 'from-purple-500 to-pink-500'
        }
      ];
    } else {
      return [
        {
          id: 'walked-out',
          title: 'We Walked Out with Dreams',
          year: 'Past',
          description: 'Carrying hopes, friendships, and the courage CUCEK gave us.',
          icon: '🌱',
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'built-paths',
          title: 'We Built Our Paths',
          year: 'Present',
          description: 'With every step forward, the lessons of CUCEK shaped our success.',
          icon: '🌳',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'come-home',
          title: 'We Come Back Home',
          year: 'Future',
          description: 'Not just to remember, but to give, to guide, and to belong once again.',
          icon: '🏡',
          color: 'from-purple-500 to-pink-500'
        }
      ];
    }
  };

  const timelineData = getTimelineData();

  // Auto-play timeline
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveMilestone((prev) => (prev + 1) % timelineData.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, timelineData.length]);

  const handleMilestoneClick = (index) => {
    setActiveMilestone(index);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Timeline Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          <span className="text-2xl sm:text-3xl mr-2">🌿</span>
          CUCEK Alumni Journey Timeline
        </h3>
        <p className="text-sm sm:text-base text-gray-600 italic">
          A natural progression of growth, success, and homecoming
        </p>
      </motion.div>

                  {/* Timeline Container */}
            <div className="relative">

        {/* Timeline Items */}
        <div className="space-y-3">
          {timelineData.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${
                activeMilestone === index ? 'z-10' : ''
              }`}
            >
              {/* Content Card */}
              <motion.div
                className={`flex-1 ${
                  activeMilestone === index ? 'transform scale-105' : ''
                }`}
                animate={{
                  scale: activeMilestone === index ? 1.05 : 1,
                  x: activeMilestone === index ? 8 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  onClick={() => handleMilestoneClick(index)}
                  className={`bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-7 shadow-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                    activeMilestone === index 
                      ? 'border-green-300 shadow-2xl bg-gradient-to-br from-white to-green-50/30' 
                      : 'border-gray-200 hover:border-green-200 hover:shadow-lg'
                  }`}
                >
                                          {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <span className="text-2xl sm:text-3xl mr-3">{milestone.icon}</span>
                            <div>
                              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                  {milestone.title}
                                </span>
                              </h4>
                              <p className="text-xs sm:text-sm text-green-600 font-semibold">
                                {milestone.year}
                              </p>
                            </div>
                          </div>
                    {activeMilestone === index && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg"
                      />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium italic">
                    {milestone.description}
                  </p>
                  
                  {/* Natural decorative element */}
                  {activeMilestone === index && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-4 flex items-center text-xs text-green-600"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-2"></div>
                      <span className="font-medium">Growing Together</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

                  {/* Navigation Dots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center items-center mt-6"
            >
              <div className="flex space-x-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                {timelineData.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleMilestoneClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeMilestone === index
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 scale-125 shadow-md'
                        : 'bg-gray-300 hover:bg-green-300 hover:scale-110'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
    </div>
  );
};

export default InteractiveTimeline;
