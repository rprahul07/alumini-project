import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { galleryAPI } from '../../services/galleryService';

const MemoryLaneGallery = () => {
  const navigate = useNavigate();
  const [activeCollegeSlide, setActiveCollegeSlide] = useState(0);
  const [activeAlumniSlide, setActiveAlumniSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(null);

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
      description: 'Bird’s eye view capturing the entire CUCEK campus',
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
        console.error('Failed to fetch gallery images:', error);
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
    setActiveCollegeSlide(index);
  };

  const handleAlumniSlideChange = (index) => {
    setActiveAlumniSlide(index);
  };

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
    // Auto-close after 6 seconds
    setTimeout(() => setSelectedMemory(null), 6000);
  };

  const handleExploreMemories = () => {
    navigate('/gallery');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
            <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
            <span>Memory Lane Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Our Journey Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
              Time & Achievement
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-semibold mb-3 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                CUCEK Gallery
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">College Memories</h3>
              <p className="text-gray-300 text-sm md:text-base">Moments that shaped our journey</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Image Slider */}
              <div className="relative h-80 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCollegeSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <OptimizedImage
                      src={collegeMemories[activeCollegeSlide].image}
                      alt={`${collegeMemories[activeCollegeSlide].title} - ${collegeMemories[activeCollegeSlide].year}`}
                      className="w-full h-full object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h4 className="text-2xl font-bold mb-2">{collegeMemories[activeCollegeSlide].title}</h4>
                        <p className="text-primary-100 mb-4">{collegeMemories[activeCollegeSlide].description}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => handleCollegeSlideChange((activeCollegeSlide - 1 + collegeMemories.length) % collegeMemories.length)}
                className="absolute left-4 top-1/3 transform -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => handleCollegeSlideChange((activeCollegeSlide + 1) % collegeMemories.length)}
                className="absolute right-4 top-1/3 transform -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {collegeMemories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCollegeSlideChange(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeCollegeSlide
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
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
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-full text-sm font-semibold mb-3 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                {galleryLoading ? 'Loading...' : 'API Gallery'}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {galleryLoading ? 'Loading Gallery...' : 'Community Gallery'}
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                {galleryLoading ? 'Fetching images from our gallery' : 'Images shared by our community'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Image Slider */}
              <div className="relative h-80 overflow-hidden">
                {galleryLoading ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                        <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Loading Gallery...</h4>
                      <p className="text-white/80 text-sm">Please wait</p>
                    </div>
                  </div>
                ) : galleryError ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-600/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                        <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Gallery Unavailable</h4>
                      <p className="text-white/80 text-sm mb-4">Unable to load gallery images</p>
                    </div>
                  </div>
                ) : galleryImages.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAlumniSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <OptimizedImage
                        src={galleryImages[activeAlumniSlide].image}
                        alt={`${galleryImages[activeAlumniSlide].title} - ${galleryImages[activeAlumniSlide].year}`}
                        className="w-full h-full object-cover"
                        fallbackSrc=""
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h4 className="text-2xl font-bold mb-2">{galleryImages[activeAlumniSlide].title}</h4>
                          <p className="text-secondary-100 mb-2">{galleryImages[activeAlumniSlide].description}</p>
                          <p className="text-sm text-secondary-200 mb-4">by {galleryImages[activeAlumniSlide].founder} (Class of {galleryImages[activeAlumniSlide].class})</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                        <i className="fas fa-images text-white text-2xl"></i>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">No Gallery Images</h4>
                      <p className="text-white/80 text-sm">Gallery images will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Arrows - Only show if gallery has images */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => handleAlumniSlideChange((activeAlumniSlide - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-4 top-1/3 transform -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleAlumniSlideChange((activeAlumniSlide + 1) % galleryImages.length)}
                    className="absolute right-4 top-1/3 transform -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Slide Indicators - Only show if gallery has images */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleAlumniSlideChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeAlumniSlide
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/75'
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
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">
                    {selectedMemory.category === 'Startup' ? '🚀' : 
                     selectedMemory.category === 'Company' ? '🏢' : 
                     selectedMemory.category === 'Reunion' ? '👥' : 
                     selectedMemory.category === 'Event' ? '🎉' : '🏛️'}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedMemory.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {selectedMemory.description}
                  </p>
                  {selectedMemory.founder && (
                    <p className="text-sm text-primary-600 font-medium">
                      by {selectedMemory.founder} (Class of {selectedMemory.class})
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {selectedMemory.achievements ? 'Key Achievements:' : 'Memories:'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(selectedMemory.achievements || selectedMemory.memories).map((item, index) => (
                    <div key={index} className="flex items-start">
                        <span className="text-primary-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-300"
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
