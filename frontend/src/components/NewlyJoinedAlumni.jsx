import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { alumniAPI } from '../services/alumniService';
import { useAuth } from '../contexts/AuthContext';

const NewlyJoinedAlumni = () => {
  const { user, loading: authLoading } = useAuth();
  const [newlyJoinedAlumni, setNewlyJoinedAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [maxItemsPerRow, setMaxItemsPerRow] = useState(6); // Default for mobile

  // Placeholder avatar for users without profile photos
  const placeholderAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1IDQ1QzE1IDM3LjI2ODcgMjEuMjY4NyAzMSAzMCAzMUMzOC43MzEzIDMxIDQ1IDM3LjI2ODcgNDUgNDVWNDdIMTVWNDVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";

  // Calculate maximum items per row based on screen size
  const calculateMaxItemsPerRow = () => {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 640) { // sm: mobile
      return 4; // 4 items on mobile
    } else if (screenWidth < 768) { // md: small tablet
      return 5; // 5 items on small tablet
    } else if (screenWidth < 1024) { // lg: tablet
      return 6; // 6 items on tablet
    } else if (screenWidth < 1280) { // xl: desktop
      return 8; // 8 items on desktop
    } else { // 2xl: large desktop
      return 10; // 10 items on large desktop
    }
  };

  // Update max items per row on window resize
  useEffect(() => {
    const handleResize = () => {
      setMaxItemsPerRow(calculateMaxItemsPerRow());
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const result = await alumniAPI.getLatestReconnects();
        
        if (result.success && result.data.length > 0) {
          // Transform API data to match component structure and limit to maxItemsPerRow
          const transformedAlumni = result.data.slice(0, maxItemsPerRow).map((alumni, index) => {
            const photoUrl = (alumni.photo && alumni.photo.trim() !== '') 
              ? alumni.photo 
              : placeholderAvatar;
            
            console.log('Alumni photo data:', {
              name: alumni.name,
              originalPhoto: alumni.photo,
              processedPhoto: photoUrl,
              isPlaceholder: photoUrl === placeholderAvatar
            });
            
            return {
              id: alumni.id || index + 1,
              name: alumni.name || 'Alumni',
              batch: alumni.batch || 'Unknown',
              photo: photoUrl,
              department: alumni.department || 'Unknown',
              reconnectedDate: new Date().toISOString()
            };
          });
          setNewlyJoinedAlumni(transformedAlumni);
        } else {
          // Fallback to sample data if API fails - showing alumni based on screen size
          const sampleData = [
            {
              id: 1,
              name: "Sarah Johnson",
              batch: "2015",
              photo: placeholderAvatar,
              department: "Computer Science",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 2,
              name: "Rajesh Kumar",
              batch: "2017",
              photo: placeholderAvatar,
              department: "Electronics",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 3,
              name: "Priya Sharma",
              batch: "2016",
              photo: placeholderAvatar,
              department: "Mechanical",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 4,
              name: "Amit Patel",
              batch: "2018",
              photo: placeholderAvatar,
              department: "Civil",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 5,
              name: "Deepika Singh",
              batch: "2014",
              photo: placeholderAvatar,
              department: "Computer Science",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 6,
              name: "Vikram Reddy",
              batch: "2019",
              photo: placeholderAvatar,
              department: "Electrical",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 7,
              name: "Anita Desai",
              batch: "2020",
              photo: placeholderAvatar,
              department: "Information Technology",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 8,
              name: "Rohit Verma",
              batch: "2013",
              photo: placeholderAvatar,
              department: "Mechanical",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 9,
              name: "Kavya Nair",
              batch: "2021",
              photo: placeholderAvatar,
              department: "Computer Science",
              reconnectedDate: new Date().toISOString()
            },
            {
              id: 10,
              name: "Arjun Menon",
              batch: "2012",
              photo: placeholderAvatar,
              department: "Electronics",
              reconnectedDate: new Date().toISOString()
            }
          ];
          setNewlyJoinedAlumni(sampleData.slice(0, maxItemsPerRow));
        }
      } catch (err) {
        console.error('Failed to fetch recently reconnected alumni:', err);
        setError('Failed to load alumni data');
        // Use fallback data
        const fallbackData = [
          {
            id: 1,
            name: "Sample Alumni",
            batch: "2015",
            photo: placeholderAvatar,
            department: "Engineering",
            reconnectedDate: new Date().toISOString()
          }
        ];
        setNewlyJoinedAlumni(fallbackData.slice(0, maxItemsPerRow));
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyReconnectedAlumni();
  }, [user, authLoading, maxItemsPerRow]);

  // No carousel logic needed for the new design

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
    <section className="py-12 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
            <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
            <span>Welcome Home</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            People who made the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
              Homecoming true
            </span>
          </h2>
        </motion.div>

        {/* Circular Alumni Photos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Enhanced Container with glass morphism */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl relative">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10 rounded-3xl"></div>
            
            <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6 lg:gap-8 relative z-10">
              {newlyJoinedAlumni.map((alumni, index) => (
                <motion.div
                  key={alumni.id}
                  className="relative flex-shrink-0 group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ 
                    scale: 1.2,
                    y: -8,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {/* Enhanced Circular Photo with animated gradient border */}
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-500">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 p-1 animate-pulse">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                          <img
                            src={alumni.photo}
                            alt={alumni.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              console.log('Image failed to load:', alumni.photo);
                              e.target.src = placeholderAvatar;
                            }}
                            onLoad={() => console.log('Image loaded successfully:', alumni.photo)}
                          />
                          {/* Overlay effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced online indicator with glow */}
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:shadow-green-400/50 transition-all duration-300">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Glow ring effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400/30 to-secondary-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
                    {/* Enhanced Hover Tooltip */}
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="absolute -top-28 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/30 min-w-max">
                            <p className="text-base font-bold text-gray-900 text-center mb-2">
                              {alumni.name}
                            </p>
                            <p className="text-sm text-primary-600 font-semibold text-center mb-1">
                              Batch {alumni.batch}
                            </p>
                            <p className="text-xs text-gray-600 text-center">
                              {alumni.department}
                            </p>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Emotional message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 backdrop-blur-xl rounded-full px-10 py-5 border border-white/30 shadow-2xl relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-full animate-pulse"></div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-4 h-4 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-lg font-bold text-white italic tracking-wide">
                Latest members to reconnect
              </span>
              <div className="w-4 h-4 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewlyJoinedAlumni;
