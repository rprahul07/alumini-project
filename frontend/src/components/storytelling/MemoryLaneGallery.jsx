import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { galleryAPI } from '../../services/galleryService';
import { useInteractionTracking, useAnalytics } from '../../hooks/useAnalytics';

const MemoryLaneGallery = () => {
  const navigate = useNavigate();
  const [activeCollegeSlide, setActiveCollegeSlide] = useState(0);
  const [activeAlumniSlide, setActiveAlumniSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(null);
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  // Analytics tracking
  const { trackClick, trackHover } = useInteractionTracking('storytelling');
  const { trackEngagement } = useAnalytics();

  // College memories data
  const collegeMemories = [
    {
      id: 1,
      year: '2025',
      title: 'Golden Hour at Campus',
      description: 'Peaceful evening view of CUCEK during golden hour',
      image: 'https://i.postimg.cc/HkYZkjvr/PXL-20250825-124106600.jpg',
      category: 'Campus Life',
      memories: ['Evening walks', 'Chilling with friends', 'Serene vibes']
    },
    {
      id: 2,
      year: '2025',
      title: 'Aerial Campus View',
      description: 'Bird\'s eye view capturing the entire CUCEK campus',
      image: 'https://i.postimg.cc/fbFBCCzd/pixelcut-export-01-jpeg.jpg',
      category: 'Infrastructure',
      memories: ['College buildings', 'Green landscapes', 'Campus pride']
    },
    {
      id: 3,
      year: '2025',
      title: 'CUCEK College Front',
      description: 'Main college building standing tall with pride',
      image: 'https://i.postimg.cc/bNNkGb8f/Whats-App-Image-2025-01-25-at-22-02-49-c6cdb553.jpg',
      category: 'Memorable Spots',
      memories: ['Morning lectures', 'Group photos', 'First-day excitement']
    }
  ];


  // Image preloading function
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Preload images to prevent white flash
  useEffect(() => {
    const preloadImages = async () => {
      const allImages = [
        ...collegeMemories.map(memory => memory.image),
        ...galleryImages.map(image => image.image)
      ].filter(Boolean);

      const preloadPromises = allImages.map(src =>
        preloadImage(src).catch(() => null)
      );

      try {
        await Promise.all(preloadPromises);
        setPreloadedImages(new Set(allImages));
      } catch (error) {
      }
    };

    if (galleryImages.length > 0) {
      preloadImages();
    }
  }, [galleryImages]);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setGalleryLoading(true);
        setGalleryError(null);
        const result = await galleryAPI.getGallery();

        if (result.success && result.data.length > 0) {
          // Transform API data to match our component structure
          const transformedImages = result.data.map((item, index) => ({
            id: item.id || index + 1,
            year: new Date(item.createdAt).getFullYear().toString(),
            title: item.title || `Gallery Image ${index + 1}`,
            description: item.description || 'A beautiful moment from our gallery',
            image: item.imageUrl || item.image || '',
            category: item.category || 'Gallery',
            founder: item.uploadedBy || 'Alumni',
            class: 'Various',
            achievements: ['Community shared', 'Memorable moment', 'Alumni contribution']
          }));
          setGalleryImages(transformedImages);
        } else {
          // No fallback data - show empty state
          setGalleryImages([]);
        }
      } catch (error) {
        setGalleryError('Failed to load gallery images');
        // No fallback data - show empty state
        setGalleryImages([]);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const collegeInterval = setInterval(() => {
      setActiveCollegeSlide((prev) => (prev + 1) % collegeMemories.length);
    }, 6000);

    const alumniInterval = setInterval(() => {
      setActiveAlumniSlide((prev) => (prev + 1) % galleryImages.length);
    }, 7000);

    return () => {
      clearInterval(collegeInterval);
      clearInterval(alumniInterval);
    };
  }, [galleryImages.length]);

  const handleCollegeSlideChange = (index) => {
    trackClick(null, `college_slide_${index}`);
    trackEngagement('gallery_slide_change', {
      gallery_type: 'college',
      slide_index: index,
      slide_title: collegeMemories[index]?.title
    });
    setActiveCollegeSlide(index);
  };

  const handleAlumniSlideChange = (index) => {
    trackClick(null, `alumni_slide_${index}`);
    trackEngagement('gallery_slide_change', {
      gallery_type: 'alumni',
      slide_index: index
    });
    setActiveAlumniSlide(index);
  };

  const handleMemoryClick = (memory) => {
    trackClick(null, `memory_${memory.id}_click`);
    trackEngagement('memory_interaction', {
      memory_id: memory.id,
      memory_title: memory.title,
      memory_category: memory.category
    });
    setSelectedMemory(memory);
    // Auto-close after 6 seconds
    setTimeout(() => setSelectedMemory(null), 6000);
  };

  const handleExploreMemories = () => {
    trackClick(null, 'explore_memories_button');
    trackEngagement('gallery_explore', {
      destination: '/gallery'
    });
    navigate('/gallery');
  };

  return (
    <section id="memory-lane" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>Memory Lane Gallery</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight font-sans tracking-tight">
            Our Journey Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Time & Achievement
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
            Discover the cherished memories of our college days and celebrate the remarkable achievements of our alumni community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - College Memories */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Gallery Title */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-xs font-semibold mb-2 shadow-lg font-sans">
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                CUCEK Gallery
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 font-sans">College Memories</h3>
              <p className="text-slate-600 text-xs md:text-sm font-sans">Moments that shaped our journey</p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border border-slate-200/50" style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}>
              {/* Image Slider */}
              <div className="relative h-80 overflow-hidden bg-slate-100">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeCollegeSlide}
                    initial={{
                      opacity: 0,
                      scale: 1.05,
                      x: 20,
                      rotateY: 5
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      rotateY: 0
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      x: -20,
                      rotateY: -5
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "tween"
                    }}
                    className="absolute inset-0"
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <OptimizedImage
                        src={collegeMemories[activeCollegeSlide].image}
                        alt={`${collegeMemories[activeCollegeSlide].title} - ${collegeMemories[activeCollegeSlide].year}`}
                        className="w-full h-full object-cover"
                        fallbackSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                        loading="eager"
                      />
                    </motion.div>

                    {/* Enhanced Overlay with Animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-6 text-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <motion.h4
                          className="text-lg font-bold mb-2 font-sans"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          {collegeMemories[activeCollegeSlide].title}
                        </motion.h4>
                        <motion.p
                          className="text-primary-100 mb-3 text-sm font-sans"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          {collegeMemories[activeCollegeSlide].description}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Enhanced Navigation Arrows */}
              <motion.button
                onClick={() => handleCollegeSlideChange((activeCollegeSlide - 1 + collegeMemories.length) % collegeMemories.length)}
                className="absolute left-4 top-1/3 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-sm border border-slate-200/50"
                aria-label="Previous slide"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: -2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </motion.svg>
              </motion.button>

              <motion.button
                onClick={() => handleCollegeSlideChange((activeCollegeSlide + 1) % collegeMemories.length)}
                className="absolute right-4 top-1/3 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-sm border border-slate-200/50"
                aria-label="Next slide"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </motion.button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {collegeMemories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCollegeSlideChange(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeCollegeSlide
                      ? 'bg-primary-500 scale-125'
                      : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Alumni Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Gallery Title */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-full text-xs font-semibold mb-2 shadow-lg font-sans">
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                {galleryLoading ? 'Loading...' : 'Alumni Memories'}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 font-sans">
                {galleryLoading ? 'Loading Gallery...' : 'Alumni Memories'}
              </h3>
              <p className="text-slate-600 text-xs md:text-sm font-sans">
                {galleryLoading ? 'Fetching memories from our alumni' : 'Cherished moments shared by our alumni community'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border border-slate-200/50" style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}>
              {/* Image Slider */}
              <div className="relative h-80 overflow-hidden bg-slate-100">
                {galleryLoading ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto animate-pulse shadow-lg" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-spinner fa-spin text-primary-600 text-lg"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Loading Gallery...</h4>
                      <p className="text-slate-600 text-xs font-sans">Please wait</p>
                    </div>
                  </div>
                ) : galleryError ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Gallery Unavailable</h4>
                      <p className="text-slate-600 text-xs mb-3 font-sans">Unable to load gallery images</p>
                    </div>
                  </div>
                ) : galleryImages.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeAlumniSlide}
                      initial={{
                        opacity: 0,
                        scale: 1.05,
                        x: -20,
                        rotateY: -5
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        rotateY: 0
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        x: 20,
                        rotateY: 5
                      }}
                      transition={{
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "tween"
                      }}
                      className="absolute inset-0"
                    >
                      <motion.div
                        className="w-full h-full"
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <OptimizedImage
                          src={galleryImages[activeAlumniSlide].image}
                          alt={`${galleryImages[activeAlumniSlide].title} - ${galleryImages[activeAlumniSlide].year}`}
                          className="w-full h-full object-cover"
                          fallbackSrc=""
                          loading="eager"
                        />
                      </motion.div>

                      {/* Enhanced Overlay with Animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-6 text-white"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          <motion.h4
                            className="text-lg font-bold mb-2 font-sans"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                          >
                            {galleryImages[activeAlumniSlide].title}
                          </motion.h4>
                          <motion.p
                            className="text-secondary-100 mb-2 text-sm font-sans"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                          >
                            {galleryImages[activeAlumniSlide].description}
                          </motion.p>
                          <motion.p
                            className="text-xs text-secondary-200 mb-3 font-sans"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                          >
                            by {galleryImages[activeAlumniSlide].founder} (Class of {galleryImages[activeAlumniSlide].class})
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-100 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-images text-slate-600 text-lg"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">No Gallery Images</h4>
                      <p className="text-slate-600 text-xs font-sans">Gallery images will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Navigation Arrows - Only show if gallery has images */}
              {galleryImages.length > 1 && (
                <>
                  <motion.button
                    onClick={() => handleAlumniSlideChange((activeAlumniSlide - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-4 top-1/3 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-sm border border-slate-200/50"
                    aria-label="Previous slide"
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.svg
                      className="w-6 h-6 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: -2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </motion.svg>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAlumniSlideChange((activeAlumniSlide + 1) % galleryImages.length)}
                    className="absolute right-4 top-1/3 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-sm border border-slate-200/50"
                    aria-label="Next slide"
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.svg
                      className="w-6 h-6 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: 2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.button>
                </>
              )}

              {/* Slide Indicators - Only show if gallery has images */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleAlumniSlideChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeAlumniSlide
                        ? 'bg-secondary-500 scale-125'
                        : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Memory Detail Modal */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-lg border border-gray-100" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-3">
                    {selectedMemory.category === 'Startup' ? '🚀' :
                      selectedMemory.category === 'Company' ? '🏢' :
                        selectedMemory.category === 'Reunion' ? '👥' :
                          selectedMemory.category === 'Event' ? '🎉' : '🏛️'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">
                    {selectedMemory.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 font-sans">
                    {selectedMemory.description}
                  </p>
                  {selectedMemory.founder && (
                    <p className="text-xs text-primary-600 font-medium font-sans">
                      by {selectedMemory.founder} (Class of {selectedMemory.class})
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 font-sans">
                    {selectedMemory.achievements ? 'Key Achievements:' : 'Memories:'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(selectedMemory.achievements || selectedMemory.memories).map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-1 text-xs">•</span>
                        <span className="text-gray-700 text-xs font-sans">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 text-sm font-sans"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MemoryLaneGallery;