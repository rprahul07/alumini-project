import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { alumniAPI } from '../services/alumniService';
import OptimizedImage from './OptimizedImage';

const NewlyJoinedAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestReconnects = async () => {
      try {
        setLoading(true);
        const response = await alumniAPI.getLatestReconnects();
        
        if (response.success) {
          setAlumni(response.data || []);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to load alumni data');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestReconnects();
  }, []);

  // Duplicate alumni array for seamless loop
  const duplicatedAlumni = [...alumni, ...alumni];

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg font-sans">
              <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
              <span>Latest Reconnects</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight font-sans">
              Welcome Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                New Alumni
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
              Meet the latest members who've joined our vibrant alumni community
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="flex justify-center items-center py-8">
            <div className="flex space-x-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse border border-blue-200 shadow-lg"></div>
                  <div className="w-20 h-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded animate-pulse"></div>
                  <div className="w-16 h-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || alumni.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg font-sans">
              <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
              <span>Latest Reconnects</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight font-sans">
              Welcome Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                New Alumni
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 font-sans">
              Meet the latest members who've joined our vibrant alumni community
            </p>
            <div className="text-slate-500 text-sm font-sans">
              {error || 'No new alumni to display at the moment'}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg font-sans">
            <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
            <span>Latest Reconnects</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight font-sans">
            Welcome Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
              New Alumni
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
            Meet the latest members who've joined our vibrant alumni community
          </p>
        </motion.div>
      </div>

      {/* Full-Width Alumni Animation - Outside Container */}
      <div className="relative overflow-hidden w-screen -mx-4 sm:-mx-6 lg:-mx-8">
        <motion.div
          className="flex space-x-8 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
          animate={{
            x: [0, -100 * alumni.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          style={{ width: `${duplicatedAlumni.length * 200}px` }}
        >
            {duplicatedAlumni.map((alumnus, index) => {
              // Debug log for first few items
              
              return (
              <motion.div
                key={`${alumnus.id || index}-${Math.floor(index / alumni.length)}`}
                className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
                whileHover={{ scale: 1.05, y: -3 }}
                transition={{ duration: 0.3 }}
              >
                {/* Enhanced Profile Picture */}
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shadow-lg group-hover:border-primary-300 transition-colors duration-300">
                    {(alumnus.photoUrl || alumnus.photo || alumnus.profilePhoto) ? (
                      <img
                        src={alumnus.photoUrl || alumnus.photo || alumnus.profilePhoto}
                        alt={alumnus.fullName || alumnus.name || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 ${(alumnus.photoUrl || alumnus.photo || alumnus.profilePhoto) ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-slate-600 text-lg font-bold">
                        {(alumnus.fullName || alumnus.name)?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Online Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-secondary-500 to-success-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>

                {/* Enhanced Alumni Info */}
                <div className="text-center max-w-[160px] space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors duration-300 font-sans leading-tight">
                    {alumnus.fullName || alumnus.name}
                  </h3>
                  
                  {/* Batch Information */}
                  {(alumnus.graduationYear || alumnus.batch) && (
                    <div className="text-xs font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-sans tracking-wide">
                      Batch {alumnus.graduationYear || alumnus.batch}
                    </div>
                  )}
                  
                  {/* Job Title */}
                  {(alumnus.currentJobTitle || alumnus.position) && (
                    <p className="text-xs text-slate-600 line-clamp-1 font-medium font-sans leading-relaxed">
                      {alumnus.currentJobTitle || alumnus.position}
                    </p>
                  )}
                  
                  {/* Company */}
                  {(alumnus.companyName || alumnus.company) && (
                    <p className="text-xs text-slate-500 line-clamp-1 font-sans leading-relaxed">
                      {alumnus.companyName || alumnus.company}
                    </p>
                  )}
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
    </section>
  );
};

export default NewlyJoinedAlumni;
