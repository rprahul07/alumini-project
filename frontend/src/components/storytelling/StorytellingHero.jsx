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
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/role-selection');
    }
  };

  const handleBrowseDirectory = () => {
    navigate('/alumni');
  };

  // Floating Card Component
  const FloatingCard = ({ delay, className, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.8 }}
      className={`absolute z-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <section className="relative min-h-[90vh] flex bg-slate-50 overflow-hidden pt-16 lg:pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-secondary-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
              <span className="flex h-2 w-2 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase font-sans">Official Alumni Network</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans text-slate-900 leading-[1.15] tracking-tight">
              Bridging the Gap Between <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Past & Future
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-sans">
              Connect with thousands of CUCEK graduates. Unlock exclusive mentorships,
              discover career opportunities, and relive your best campus moments.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleJoinNetwork}
                className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow-lg shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center font-sans"
              >
                Join the Network
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={handleBrowseDirectory}
                className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 hover:border-primary-200 hover:text-primary-700 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center font-sans"
              >
                Browse Directory
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600">
                  +2k
                </div>
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 font-sans">Trusted Community</p>
                <p className="text-slate-500 font-sans">growing every day</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visuals */}
          <div className="relative h-[400px] lg:h-[500px] mt-12 lg:mt-0">
            {/* Main Image Blob Mask */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-10"
            >
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl skew-y-3 border-4 border-white">
                <OptimizedImage
                  src="https://i.postimg.cc/z8Yh8P4R/Thirike-1.jpg?w=800&q=80&format=webp"
                  alt="Alumni Networking"
                  className="w-full h-full object-cover scale-105"
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </motion.div>

            {/* Functional Floating Cards */}

            {/* Card 1: Mentorship */}
            <FloatingCard delay={1.2} className="hidden md:block top-10 -left-12 w-64 animate-[float_4s_ease-in-out_infinite]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-primary-500 flex items-center justify-center text-white shrink-0">
                  🎓
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 font-sans">Mentorship Match</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-sans">You matched with a Senior Engineer from Google!</p>
                </div>
              </div>
            </FloatingCard>

            {/* Card 2: Upcoming Event */}
            <FloatingCard delay={1.4} className="hidden md:block bottom-20 -right-8 w-60 animate-[float_5s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-secondary-50 text-secondary-600 flex flex-col items-center justify-center text-xs font-bold border border-secondary-100 shrink-0">
                  <span>OCT</span>
                  <span className="text-lg">24</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 font-sans">Annual Reunion</p>
                  <p className="text-[10px] text-slate-500 font-sans">Main Auditorium • 10 AM</p>
                  <div className="flex -space-x-1 mt-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-slate-200 border border-white"></div>)}
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Card 3: Job Alert */}
            <FloatingCard delay={1.6} className="hidden md:block top-1/2 -right-12 w-56 animate-[float_6s_ease-in-out_infinite_0.5s]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider font-sans">New Job Alert</span>
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 font-sans">Software Architect</p>
                <p className="text-[10px] text-slate-500 font-sans">Remote • $120k - $160k</p>
                <button className="mt-2 w-full py-1 bg-slate-50 text-slate-600 text-[10px] font-semibold rounded hover:bg-slate-100 transition-colors">View Details</button>
              </div>
            </FloatingCard>

          </div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingHero;
