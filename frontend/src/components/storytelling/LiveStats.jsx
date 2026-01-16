import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LiveStats = ({ statsData, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use real data from API or fallback to default values
  const stats = [
    {
      id: 'members',
      value: statsData?.alumniMembers || 15000,
      label: 'Alumni Members',
      color: 'from-blue-500 to-cyan-500',
      suffix: '+'
    },
    {
      id: 'countries',
      value: 45, // This could be added to the API later
      label: 'Countries',
      color: 'from-green-500 to-emerald-500',
      suffix: '+'
    },
    {
      id: 'events',
      value: statsData?.eventsHosted || 300,
      label: 'Events Hosted',
      color: 'from-purple-500 to-pink-500',
      suffix: '+'
    },
    {
      id: 'activeUsers',
      value: statsData?.activeUsers || 2000,
      label: 'Active Users',
      color: 'from-orange-500 to-red-500',
      suffix: '+'
    },
    {
      id: 'jobs',
      value: 20, // This could be added to the API later
      label: 'Jobs Posted',
      color: 'from-indigo-500 to-purple-500',
      suffix: '+'
    },
    {
      id: 'startups',
      value: 80, // This could be added to the API later
      label: 'Startups Founded',
      color: 'from-teal-500 to-cyan-500',
      suffix: '+'
    }
  ];

  // Counter animation hook
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (inView && !isAnimating) {
        setIsAnimating(true);
        let startTime;
        const startValue = 0;
        const endValue = end;

        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);

          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

          setCount(currentValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(endValue);
          }
        };

        requestAnimationFrame(animate);
      }
    }, [inView, end, duration, isAnimating]);

    return count;
  };

  // Pre-calculate all counter values to avoid calling hooks in map
  const animatedValues = stats.map((stat, index) =>
    useCounter(stat.value, 1500 + index * 100)
  );

  return (
    <section id="live-stats" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-50/30 to-secondary-50/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>Every Story Starts Here</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight font-sans tracking-tight">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Growing Impact
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4 font-sans">
            From the moment we walked through CUCEK's gates, we became part of something bigger than ourselves.
            Today, our family continues to grow, each new member adding their unique chapter to our collective story.
          </p>
          <p className="text-sm text-slate-500 italic font-sans">
            From every corner of the world, our CUCEK family grows stronger together.
          </p>
        </motion.div>

        {/* Compact Stats Grid */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-slate-200/50 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  {/* Loading Value */}
                  <div className="mb-2">
                    <div className="text-xl md:text-2xl font-bold text-slate-400 mb-1 animate-pulse font-sans">
                      ---
                    </div>
                    <div className="text-xs font-semibold text-slate-500 leading-tight animate-pulse font-sans">
                      Loading...
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            stats.map((stat, index) => {
              const animatedValue = animatedValues[index];

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-slate-200/50 hover:border-primary-300 hover:bg-white/95 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center shadow-lg" style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}>
                    {/* Compact Value */}
                    <div className="mb-2">
                      <motion.div
                        className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mb-1 font-sans"
                        key={animatedValue}
                      >
                        {animatedValue.toLocaleString()}{stat.suffix}
                      </motion.div>
                      <div className="text-xs font-semibold text-slate-700 leading-tight font-sans">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Inspirational Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto mt-8"
        >
          <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 shadow-lg relative overflow-hidden" style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-secondary-100/30 rounded-3xl animate-pulse"></div>

            <div className="text-center relative z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-3 shadow-lg" style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                "
              </div>
              <blockquote className="text-sm md:text-base italic text-slate-700 leading-relaxed mb-3 font-medium font-sans">
                "We didn't just graduate from CUCEK—we became part of a legacy that grows stronger with every new member who joins our journey."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-6 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2"></div>
                <span className="text-primary-600 font-semibold text-xs font-sans">
                  — The CUCEK Family
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 backdrop-blur-xl rounded-3xl p-5 border border-slate-200/50 shadow-lg max-w-lg mx-auto relative overflow-hidden" style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-secondary-100/30 rounded-3xl animate-pulse"></div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                Be Part of Our Growing Story
              </h3>
              <p className="text-sm text-slate-600 mb-3 font-sans">
                Join thousands of alumni making a difference worldwide.
              </p>
              {!user && (
                <motion.button
                  onClick={() => navigate('/role-selection')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl text-xs font-sans"
                >
                  <span className="mr-2">Join Our Network</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;