import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { alumniAPI } from '../services/alumniService';
import { useAuth } from '../contexts/AuthContext';

const NewlyJoinedAlumni = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newlyJoinedAlumni, setNewlyJoinedAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default images for fallback
  const defaultImages = {
    alumni1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    alumni2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    alumni3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    alumni4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  // Fetch recently reconnected alumni from API
  useEffect(() => {
    // Only fetch if user is authenticated
    if (!user && !authLoading) {
      setLoading(false);
      return;
    }

    // If still loading auth, show loading state
    if (authLoading) {
      setLoading(true);
      return;
    }

    const fetchRecentlyReconnectedAlumni = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await alumniAPI.getNewlyJoined();
        
        if (result.success && result.data.length > 0) {
          // Transform API data to match component structure
          const transformedAlumni = result.data.map((alumni, index) => ({
            id: alumni.id || index + 1,
            name: alumni.user?.fullName || 'Alumni',
            batch: alumni.graduationYear || '2018',
            photo: alumni.user?.photoUrl || defaultImages[`alumni${(index % 4) + 1}`],
            department: alumni.department || 'Engineering',
            reconnectedDate: alumni.updatedAt || alumni.createdAt
          }));
          setNewlyJoinedAlumni(transformedAlumni);
        } else {
          // Fallback to sample data if API fails - showing alumni from different years
          setNewlyJoinedAlumni([
            {
              id: 1,
              name: "Sarah Johnson",
              batch: "2015",
              photo: defaultImages.alumni1,
              department: "Computer Science",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 2,
              name: "Rajesh Kumar",
              batch: "2017",
              photo: defaultImages.alumni2,
              department: "Electronics",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 3,
              name: "Priya Sharma",
              batch: "2016",
              photo: defaultImages.alumni3,
              department: "Mechanical",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 4,
              name: "Amit Patel",
              batch: "2018",
              photo: defaultImages.alumni4,
              department: "Civil",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 5,
              name: "Deepika Singh",
              batch: "2014",
              photo: defaultImages.alumni1,
              department: "Computer Science",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 6,
              name: "Vikram Reddy",
              batch: "2019",
              photo: defaultImages.alumni2,
              department: "Electrical",
              reconnectedDate: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch recently reconnected alumni:', err);
        setError('Failed to load alumni data');
        // Use fallback data
        setNewlyJoinedAlumni([
          {
            id: 1,
            name: "Sample Alumni",
            batch: "2015",
            photo: defaultImages.alumni1,
            department: "Engineering",
            reconnectedDate: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyReconnectedAlumni();
  }, [user, authLoading]);

  // Auto-slide effect - fully automatic
  useEffect(() => {
    if (newlyJoinedAlumni.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newlyJoinedAlumni.length);
    }, 4000); // Increased to 4 seconds for better viewing

    return () => clearInterval(interval);
  }, [newlyJoinedAlumni.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % newlyJoinedAlumni.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + newlyJoinedAlumni.length) % newlyJoinedAlumni.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-secondary-50 via-white to-primary-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base">Loading reconnected alumni...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show component if user is not authenticated
  if (!user && !authLoading) {
    return null;
  }

  // Error state or no data
  if (error || newlyJoinedAlumni.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-secondary-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-secondary-200/20 to-primary-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-white/80 backdrop-blur-sm text-primary-700 border border-primary-200 mb-3 md:mb-4">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-500 rounded-full mr-1.5 md:mr-2"></span>
            <span className="hidden sm:inline">Welcome Back</span>
            <span className="sm:hidden">Welcome Back</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Alumni{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Reconnected
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl md:max-w-2xl mx-auto px-4">
            Alumni who have reconnected with our community after years
          </p>
        </motion.div>

        {/* Sliding Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl">
            {/* Alumni Cards Container */}
            <div className="relative h-20 sm:h-24 md:h-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex items-center justify-center px-3 sm:px-6 md:px-8">
                    {/* Uniform Alumni Card */}
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border border-primary-200/50 shadow-lg w-full max-w-md">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 md:border-4 border-gradient-to-r from-primary-500 to-secondary-500 shadow-lg">
                          <OptimizedImage
                            src={newlyJoinedAlumni[currentIndex]?.photo}
                            alt={newlyJoinedAlumni[currentIndex]?.name}
                            className="w-full h-full object-cover"
                            fallbackSrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
                          />
                        </div>
                        {/* Welcome Badge */}
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✨</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                          {newlyJoinedAlumni[currentIndex]?.name}
                        </h3>
                        <p className="text-primary-600 font-semibold text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1">
                          Batch {newlyJoinedAlumni[currentIndex]?.batch}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {newlyJoinedAlumni[currentIndex]?.department} Engineering
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {newlyJoinedAlumni.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200/50"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200/50"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {newlyJoinedAlumni.length > 1 && (
            <div className="flex justify-center mt-4 md:mt-6 space-x-1.5 md:space-x-2">
              {newlyJoinedAlumni.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewlyJoinedAlumni;
