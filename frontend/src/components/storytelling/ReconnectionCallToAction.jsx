import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ReconnectionCallToAction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showEmotionalTrigger, setShowEmotionalTrigger] = useState(false);

  // Reconnection steps
  const reconnectionSteps = [
    {
      id: 1,
      title: 'Login',
      icon: '🔑',
      description: 'Sign in to your account',
      action: 'Access your profile and reconnect with old friends',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Connect',
      icon: '🤝',
      description: 'Find old friends and classmates',
      action: 'Reach out to people who shared your CUCEK journey',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'Engage',
      icon: '🎉',
      description: 'Join events and activities',
      action: 'Participate in reunions, workshops, and networking events',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Emotional triggers for nostalgia
  const emotionalTriggers = [
    'Remember the canteen? The library? Your favorite spot?',
    'They\'re all waiting for you to return...',
    'The friendships you made, the lessons you learned...',
    'Come back and relive those precious moments!'
  ];

  // Auto-advance emotional triggers
  useEffect(() => {
    if (showEmotionalTrigger) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % emotionalTriggers.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showEmotionalTrigger]);

  // Show emotional triggers after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setShowEmotionalTrigger(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/role-selection');
    }
  };

  const handleExploreNetwork = () => {
    navigate('/alumni');
  };

  const handleJoinEvents = () => {
    navigate('/events');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/90 backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Come Back to CUCEK
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            We Miss You at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              CUCEK!
            </span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            The doors of CUCEK are always open for you. Come back and relive the memories that made you who you are today.
          </p>
        </motion.div>

        {/* Emotional Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <AnimatePresence mode="wait">
              {showEmotionalTrigger && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[4rem] flex items-center justify-center"
                >
                  <p className="text-2xl md:text-3xl text-white font-medium text-center">
                    {emotionalTriggers[currentStep]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Reconnection Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reconnectionSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.id}
                  </div>
                  
                  {/* Step Icon */}
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white text-3xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/80 mb-4">{step.description}</p>
                    <p className="text-white/70 text-sm">{step.action}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personalized Invitation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              {user ? `Welcome back, ${user.fullName || 'Alumni'}!` : 'Ready to come back?'}
            </h3>
            <p className="text-white/80 text-lg mb-6">
              {user 
                ? 'Your CUCEK family is waiting for you. Explore your network and reconnect with old friends.'
                : 'Join thousands of alumni who have already reconnected with their CUCEK family.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <button
                    onClick={handleExploreNetwork}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-2">Explore Your Network</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleJoinEvents}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-2">Join Events</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                >
                  <span className="mr-3">🚪 Knock on the Door</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Final Emotional Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
            <h3 className="text-3xl font-bold text-white mb-4">
              🏠 CUCEK is Your Home
            </h3>
            <p className="text-white/90 text-lg leading-relaxed">
              No matter where life takes you, CUCEK will always be the place where your journey began. 
              The professors who guided you, the friends who supported you, and the memories that shaped you - 
              they're all here, waiting to welcome you back with open arms.
            </p>
            <div className="mt-6 text-2xl">
              🎓 🚪 🏛️ 💙
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReconnectionCallToAction;
