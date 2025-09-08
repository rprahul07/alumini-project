import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LiveStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });
  const navigate = useNavigate();

  const stats = [
  {
  id: 'members',
  value: 15000,
  label: 'Alumni Members',
  icon: '👥',
  color: 'from-blue-500 to-cyan-500',
  suffix: '+'
},
{
  id: 'countries',
  value: 45,
  label: 'Countries',
  icon: '🌍',
  color: 'from-green-500 to-emerald-500',
  suffix: '+'
},
{
  id: 'events',
  value: 300,
  label: 'Events Hosted',
  icon: '🎉',
  color: 'from-purple-500 to-pink-500',
  suffix: '+'
},
{
  id: 'mentorship',
  value: 2000,
  label: 'Mentorship Hours',
  icon: '🤝',
  color: 'from-orange-500 to-red-500',
  suffix: '+'
},
{
  id: 'jobs',
  value: 400,
  label: 'Jobs Posted',
  icon: '💼',
  color: 'from-indigo-500 to-purple-500',
  suffix: '+'
},
{
  id: 'startups',
  value: 80,
  label: 'Startups Founded',
  icon: '🚀',
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

  return (
    <section id="live-stats" className="py-12 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
            <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
            <span>Every Story Starts Here</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
              Growing Impact
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
            From the moment we walked through CUCEK's gates, we became part of something bigger than ourselves. 
            Today, our family continues to grow, each new member adding their unique chapter to our collective story.
          </p>
          <p className="text-sm md:text-base text-gray-400 italic">
            From every corner of the world, our CUCEK family grows stronger together.
          </p>
        </motion.div>

        {/* Compact Stats Grid */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => {
            const animatedValue = useCounter(stat.value, 1500 + index * 100);
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center shadow-2xl">
                  {/* Compact Icon */}
                  <div className="mb-3">
                    <motion.div
                      className={`w-12 h-12 mx-auto bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                  </div>

                  {/* Compact Value */}
                  <div className="mb-2">
                    <motion.div
                      className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-1"
                      key={animatedValue}
                    >
                      {animatedValue.toLocaleString()}{stat.suffix}
                    </motion.div>
                    <div className="text-sm font-semibold text-gray-300 leading-tight">{stat.label}</div>
                  </div>

                  {/* Compact Progress bar */}
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.3 + index * 0.05 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Inspirational Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto mt-12"
        >
          <div className="bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-2xl animate-pulse"></div>
            
            <div className="text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-4 shadow-lg">
                "
              </div>
              <blockquote className="text-base md:text-lg italic text-white leading-relaxed mb-4 font-medium">
                "We didn't just graduate from CUCEK—we became part of a legacy that grows stronger with every new member who joins our journey."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3"></div>
                <span className="text-primary-400 font-semibold text-sm">
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
          className="text-center mt-8"
        >
          <div className="bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-xl animate-pulse"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">
                Be Part of Our Growing Story
              </h3>
              <p className="text-base text-gray-300 mb-4">
                Join thousands of alumni making a difference worldwide.
              </p>
              <motion.button
                onClick={() => navigate('/role-selection')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                <span className="mr-2">Join Our Network</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;