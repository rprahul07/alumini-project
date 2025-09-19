import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const JoinNetworkCTA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinNetwork = () => {
    if (user) {
      // Navigate to user's dashboard or network page
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/role-selection');
    }
  };

  // Don't show the CTA if user is already logged in
  if (user) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg font-sans">
              <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
              <span>Join Our Community</span>
            </div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight font-sans"
            >
              Ready to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                Reconnect?
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 font-sans"
            >
              Join our vibrant alumni network and stay connected with your fellow graduates, 
              discover new opportunities, and be part of our growing community.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinNetwork}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 text-white rounded-full font-semibold text-lg sm:text-base shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 transform backdrop-blur-sm border border-white/20 font-sans"
              >
                Join Our Network
              </motion.button>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-6 pt-6"
            >
              <div className="flex items-center text-slate-600 text-sm font-medium">
                <div className="w-1 h-1 bg-primary-400 rounded-full mr-1.5"></div>
                <span>Network with Alumni</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm font-medium">
                <div className="w-1 h-1 bg-secondary-400 rounded-full mr-1.5"></div>
                <span>Career Opportunities</span>
              </div>
              <div className="flex items-center text-slate-600 text-sm font-medium">
                <div className="w-1 h-1 bg-green-400 rounded-full mr-1.5"></div>
                <span>Exclusive Events</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinNetworkCTA;
