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
    <section id="live-stats" className="py-12 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-2xl animate-pulse"></div>
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
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border border-green-200 mb-4">
            <span className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-2 animate-pulse"></span>
            Every Story Starts Here
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Growing Impact
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            From the moment we walked through CUCEK's gates, we became part of something bigger than ourselves. 
            Today, our family continues to grow, each new member adding their unique chapter to our collective story.
          </p>
          <p className="text-sm text-gray-500 italic">
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
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 hover:border-green-300 hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center">
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
                      className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-1"
                      key={animatedValue}
                    >
                      {animatedValue.toLocaleString()}{stat.suffix}
                    </motion.div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">{stat.label}</div>
                  </div>

                  {/* Compact Progress bar */}
                  <div className="w-full bg-green-100 rounded-full h-1 overflow-hidden">
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
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100 relative overflow-hidden">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-4 shadow-md">
                "
              </div>
              <blockquote className="text-lg md:text-xl italic text-gray-700 leading-relaxed mb-4 font-medium">
                "We didn't just graduate from CUCEK—we became part of a legacy that grows stronger with every new member who joins our journey."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-3"></div>
                <span className="text-green-600 font-semibold text-sm">
                  — The CUCEK Family
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compact Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 backdrop-blur-sm rounded-xl p-6 border border-green-200 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Be Part of Our Growing Story
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join thousands of alumni making a difference worldwide.
            </p>
            <motion.button
              onClick={() => navigate('/role-selection')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              <span className="mr-2">Join Our Network</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;