import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';

const StorytellingHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleJoinNetwork = () => {
    if (user) {
      // Navigate to user's dashboard or network page
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/role-selection');
    }
  };

  const handleReliveMemories = () => {
    // Scroll to the Memory Lane Gallery section
    const memoriesSection = document.getElementById('memory-lane');
    if (memoriesSection) {
      memoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible">
      {/* Image Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background Color Fallback */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"
          animate={{
            background: [
              "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)",
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
              "linear-gradient(135deg, #334155 0%, #0f172a 50%, #1e293b 100%)",
              "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        
        <motion.div
          className="w-full h-full"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: imageLoaded ? 1 : 1.1, 
            opacity: imageLoaded ? 1 : 0 
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            scale: { duration: 1.5, ease: "easeOut" }
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.6, ease: "easeOut" }
          }}
        >
          <OptimizedImage
            src="https://i.postimg.cc/z8Yh8P4R/Thirike-1.jpg"
            alt="Professional alumni network meeting and reconnecting - CUCEK Alumni Connect"
            className="w-full h-full object-cover"
            priority={true}
            quality={85}
            fallbackSrc="/Thirike (1).jpg"
            wrapperClassName="w-full h-full"
            style={{ filter: 'brightness(0.75) saturate(1.1) contrast(1.15) hue-rotate(10deg)' }}
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {/* Bottom gradient for smooth transition to white section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 via-white/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-40 max-w-5xl mx-auto px-6 py-8 text-center overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6 relative z-40"
        >

          {/* Main Heading - More Elegant */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sans leading-relaxed relative z-40"
            style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-white drop-shadow-2xl font-sans">
              Reconnect, Inspire,
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-secondary-300 to-primary-300 drop-shadow-2xl mt-2 font-sans">
              and Grow Together
            </span>
          </motion.h1>


          {/* CTA Button - Only show for non-joined users */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinNetwork}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 text-white rounded-full font-semibold text-lg sm:text-xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 transform backdrop-blur-sm border border-white/20 font-sans"
              >
                Join Our Network
              </motion.button>
            </motion.div>
          )}

          {/* Minimal Feature Indicators - Less Crowded */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex justify-center gap-6 pt-6"
          >
            <div className="flex items-center text-white/80 text-sm sm:text-base font-medium">
              <div className="w-1 h-1 bg-primary-400 rounded-full mr-1.5"></div>
              <span>Cherished Memories</span>
            </div>
            <div className="flex items-center text-white/80 text-sm sm:text-base font-medium">
              <div className="w-1 h-1 bg-secondary-400 rounded-full mr-1.5"></div>
              <span>Lifelong Bonds</span>
            </div>
            <div className="flex items-center text-white/80 text-sm sm:text-base font-medium">
              <div className="w-1 h-1 bg-green-400 rounded-full mr-1.5"></div>
              <span>Shared Stories</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorytellingHero;
