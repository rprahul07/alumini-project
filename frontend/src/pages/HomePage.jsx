import React, { useState, useEffect, memo, lazy, Suspense, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { testimonialsAPI } from "../services/testimonialsService";
import { dashboardAPI } from "../services/dashboardService";
import { announcementAPI } from "../services/announcementService";
import { spotlightAPI } from "../services/spotlightService";
import { useParallax, useParallaxTransform } from "../hooks/useParallax";
import { useInteractionTracking, useAnalytics } from "../hooks/useAnalytics";
import Navbar from '../components/Navbar';
import OptimizedImage from '../components/OptimizedImage';
import AccessibleBadge from '../components/AccessibleBadge';
import SEOHead from '../components/SEOHead';
import AnnouncementNotification from '../components/AnnouncementNotification';
import NewlyJoinedAlumni from '../components/NewlyJoinedAlumni';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load heavy storytelling components for better performance
const StorytellingHero = lazy(() => import('../components/storytelling/StorytellingHero'));
const MemoryLaneGallery = lazy(() => import('../components/storytelling/MemoryLaneGallery'));
const CampusHotspots = lazy(() => import('../components/storytelling/CampusHotspots'));
const LiveStats = lazy(() => import('../components/storytelling/LiveStats'));
const AnimatedTestimonialRows = lazy(() => import('../components/AnimatedTestimonialRows'));

// Loading component for lazy-loaded components
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="text-gray-600 text-lg mt-4 font-medium">Loading...</p>
    </div>
  </div>
);

// Default images in case the remote images fail to load
const defaultImages = {
  hero: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
  about: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  // Placeholder avatar for users without profile photos
  placeholderAvatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1IDQ1QzE1IDM3LjI2ODcgMjEuMjY4NyAzMSAzMCAzMUMzOC43MzEzIDMxIDQ1IDM3LjI2ODcgNDUgNDVWNDdIMTVWNDVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo="
};

const featuresData = [
  {
    icon: "🌐",
    title: "Global Alumni Network",
    description: "Connect with thousands of CUCEK graduates working in India and abroad. Build lifelong professional relationships and expand your reach.",
    category: "Networking",
    stats: "7,500+ Alumni",
    color: "from-primary-500 to-primary-600"
  },
  {
    icon: "💼",
    title: "Career Advancement",
    description: "Access job opportunities, mentorship programs, and career guidance shared by industry leaders and alumni.",
    category: "Career",
    stats: "Opportunities Shared",
    color: "from-secondary-500 to-secondary-600"
  },
  {
    icon: "🎉",
    title: "Exclusive Events",
    description: "Join reunions, workshops, and networking meetups organized by CUCEK alumni chapters and the college.",
    category: "Events",
    stats: "Regular Alumni Meets",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: "📚",
    title: "Knowledge Hub",
    description: "Access shared resources, research papers, and industry insights contributed by CUCEK alumni.",
    category: "Resources",
    stats: "Growing Repository",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: "🤝",
    title: "Mentorship Programs",
    description: "Get guidance from senior alumni or mentor current students to support the next generation of engineers.",
    category: "Mentorship",
    stats: "Active Mentors",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: "🏆",
    title: "Alumni Recognition",
    description: "Celebrate achievements, showcase alumni success stories, and highlight contributions to the community.",
    category: "Recognition",
    stats: "Annual Awards",
    color: "from-orange-500 to-red-600"
  },
];


const filters = [
  "All Features",
  "Networking",
  "Career",
  "Events",
  "Resources",
  "Mentorship",
  "Recognition",
];

const HomePage = memo(() => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { trackClick, trackHover, trackSubmit } = useInteractionTracking('homepage');
  const { trackEngagement } = useAnalytics();
  const [activeFilter, setActiveFilter] = useState("All Features");
  const [stats, setStats] = useState({
    alumniMembers: 0,
    activeUsers: 0,
    eventsHosted: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [spotlights, setSpotlights] = useState([]);
  const [spotlightsLoading, setSpotlightsLoading] = useState(true);
  const [currentSpotlightIndex, setCurrentSpotlightIndex] = useState(0);

  // Memoized filtered features for better performance
  const filteredFeatures = useMemo(() => {
    if (activeFilter === "All Features") {
      return featuresData;
    }
    return featuresData.filter(feature => 
      feature.categories.some(category => category === activeFilter)
    );
  }, [activeFilter]);

  // Parallax effects - optimized for better performance
  const parallaxSlow = useParallax(0.2); // Reduced speed for smoother effect
  const parallaxMedium = useParallax(0.3);
  const parallaxFast = useParallax(0.4);
  const parallaxX = useParallaxTransform(0.2, 'x');
  const parallaxY = useParallaxTransform(0.3, 'y');

  // Memoized analytics tracking functions for better performance
  const handleFeatureClick = useCallback((featureTitle) => {
    trackClick(null, `feature_${featureTitle.toLowerCase().replace(' ', '_')}`);
  }, [trackClick]);

  const handleHeroAction = useCallback((actionType) => {
    trackEngagement(`hero_${actionType}`, {
      user_type: user?.role || 'guest',
      page_section: 'hero'
    });
  }, [trackEngagement, user?.role]);

  const handleTestimonialInteraction = useCallback((interactionType, testimonialId) => {
    trackEngagement(`testimonial_${interactionType}`, {
      testimonial_id: testimonialId,
      page_section: 'testimonials'
    });
  }, [trackEngagement]);

  const handleAnnouncementClick = useCallback((announcementId) => {
    trackClick(null, `announcement_${announcementId}`);
  }, [trackClick]);

  const handleSpotlightInteraction = useCallback((interactionType, spotlightId) => {
    trackEngagement(`spotlight_${interactionType}`, {
      spotlight_id: spotlightId,
      page_section: 'spotlight'
    });
  }, [trackEngagement]);


  // Fetch and animate network stats
  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        setStatsLoading(true);
        const result = await dashboardAPI.getStats();
        
        if (result.success && result.data) {
          setStats({
            alumniMembers: result.data.totalAlumni || 0,
            activeUsers: result.data.totalUsers || 0,
            eventsHosted: result.data.eventscount || 0,
          });
        } else {
          // Set some default values for testing
          setStats({
            alumniMembers: 1250,
            activeUsers: 1800,
            eventsHosted: 45,
          });
        }
      } catch (error) {
        // Set some default values for testing
        setStats({
          alumniMembers: 1250,
          activeUsers: 1800,
          eventsHosted: 45,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      fetchNetworkStats();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Animation removed for better performance - stats display directly

  // Fetch all data in parallel for better performance
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Set all loading states to true
        setTestimonialsLoading(true);
        setAnnouncementsLoading(true);
        setSpotlightsLoading(true);
        setStatsLoading(true);

        // Fetch all data in parallel
        const [testimonialsRes, announcementsRes, spotlightsRes, statsRes] = await Promise.allSettled([
          testimonialsAPI.getPublic(),
          announcementAPI.getAllAnnouncements(),
          spotlightAPI.getAllSpotlights(),
          dashboardAPI.getStats()
        ]);

        // Handle testimonials
        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.success) {
          const sortedTestimonials = testimonialsRes.value.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const transformedTestimonials = sortedTestimonials.slice(0, 3).map(testimonial => ({
            id: testimonial.id,
            content: testimonial.content,
            createdAt: testimonial.createdAt,
            name: testimonial.user?.fullName || 'Alumni',
            department: testimonial.user?.department || 'Engineering',
            photoUrl: (testimonial.user?.photoUrl && testimonial.user.photoUrl.trim() !== '') 
              ? testimonial.user.photoUrl 
              : defaultImages.placeholderAvatar,
            graduationYear: testimonial.user?.alumni?.graduationYear || '2020',
            course: testimonial.user?.alumni?.course || 'Computer Science',
            currentJobTitle: testimonial.user?.alumni?.currentJobTitle || 'Software Engineer',
            companyName: testimonial.user?.alumni?.companyName || 'Tech Company'
          }));
          setTestimonials(transformedTestimonials);
        } else {
          setTestimonials([]);
        }

        // Handle announcements
        if (announcementsRes.status === 'fulfilled' && announcementsRes.value.success) {
          setAnnouncements(announcementsRes.value.data.slice(0, 3));
        } else {
          setAnnouncements([]);
        }

        // Handle spotlights
        if (spotlightsRes.status === 'fulfilled' && spotlightsRes.value.success) {
          const transformedSpotlights = spotlightsRes.value.data.map(spotlight => ({
            id: spotlight.id,
            title: spotlight.title,
            description: spotlight.description,
            redirectionUrl: spotlight.redirectionUrl,
            user: {
              fullName: spotlight.user?.fullName || 'Alumni',
              photoUrl: (spotlight.user?.photoUrl && spotlight.user.photoUrl.trim() !== '') 
                ? spotlight.user.photoUrl 
                : defaultImages.placeholderAvatar,
              department: spotlight.user?.department || 'Engineering',
              graduationYear: spotlight.user?.alumni?.graduationYear || '2020',
              currentJobTitle: spotlight.user?.alumni?.currentJobTitle || 'Professional',
              companyName: spotlight.user?.alumni?.companyName || 'Leading Company'
            }
          }));
          setSpotlights(transformedSpotlights);
        } else {
          setSpotlights([]);
        }

        // Handle stats
        if (statsRes.status === 'fulfilled' && statsRes.value.success) {
          const statsData = statsRes.value.data;
          setStats({
            alumniMembers: statsData.totalAlumni || 0,
            activeUsers: statsData.totalUsers || 0,
            eventsHosted: statsData.eventscount || 0,
          });
        } else {
          setStats({
            alumniMembers: 0,
            activeUsers: 0,
            eventsHosted: 0,
          });
        }
      } catch (error) {
        // Set fallback data
        setTestimonials([]);
        setAnnouncements([]);
        setSpotlights([]);
        setStats({
          alumniMembers: 0,
          activeUsers: 0,
          eventsHosted: 0,
        });
      } finally {
        setTestimonialsLoading(false);
        setAnnouncementsLoading(false);
        setSpotlightsLoading(false);
        setStatsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Auto-rotate spotlights
  useEffect(() => {
    if (spotlights.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSpotlightIndex((prev) => (prev + 1) % spotlights.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [spotlights.length]);

  // Set light background for home page
  useEffect(() => {
    // Set light background
    document.body.style.backgroundColor = '#f9fafb'; // gray-50
    document.documentElement.style.backgroundColor = '#f9fafb';
    
    // Cleanup function to reset background when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null;
    e.target.src = fallbackSrc;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading CUCEK Alumni Connect...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead />
      <Navbar isHome />
      
      {/* Floating Announcement Notification */}
      <AnnouncementNotification 
        announcements={announcements} 
        loading={announcementsLoading} 
      />
      
      <div className="min-h-screen bg-gray-50">
        
        {/* Interactive Storytelling Hero Section */}
        <section id="hero">
          <Suspense fallback={<ComponentLoader />}>
            <StorytellingHero />
          </Suspense>
        </section>

        {/* Latest Reconnect - Newly Joined Alumni */}
        <NewlyJoinedAlumni />

        {/* Memory Lane Gallery */}
        <Suspense fallback={<ComponentLoader />}>
          <MemoryLaneGallery />
        </Suspense>

        {/* Beautiful Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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
            {/* Enhanced Header with Better Emphasis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>💬 Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                What Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  Alumni Say
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-body">
                Discover inspiring stories from our graduates who are making a difference in their fields
              </p>
            </motion.div>

            {/* Testimonial Carousel */}
            {testimonialsLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading testimonials...</p>
              </motion.div>
            ) : testimonials.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Testimonials Yet</h3>
                <p className="text-gray-600">Be the first to share your CUCEK experience!</p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Both Desktop and Mobile: Animated Testimonial Rows */}
                <div className="px-2 sm:px-4">
                  <Suspense fallback={<ComponentLoader />}>
                    <AnimatedTestimonialRows testimonials={testimonials} />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Our Growth Impact - Live Stats */}
        <Suspense fallback={<ComponentLoader />}>
          <LiveStats statsData={stats} loading={statsLoading} />
        </Suspense>


        {/* Enhanced Features Section */}
        <section id="features" className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Why Join CUCEK Alumni Connect</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Unlock Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  Alumni Potential
                  </span>
                </h2>
                <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-body">
                Join thousands of successful CUCEK graduates who are shaping the future through our powerful alumni network
                </p>
              </motion.div>

            {/* Filter Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              className="mb-10 flex flex-wrap justify-center gap-2"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                      : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/30'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>

            {/* Features Grid */}
                  <motion.div
              initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuresData
                .filter((f) => activeFilter === "All Features" || f.category === activeFilter)
                .map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full shadow-2xl">
                          {/* Icon */}
                      <div className="flex items-center justify-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} text-white flex items-center justify-center rounded-xl group-hover:scale-110 transition-all duration-300 shadow-md`}>
                          <span className="text-lg">{feature.icon}</span>
                            </div>
                          </div>
                          
                          {/* Content */}
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300 text-center">
                        {feature.title}
                              </h3>
                      <p className="text-gray-300 leading-relaxed text-base text-center font-medium">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
              <div className="bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/30 shadow-2xl relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-2xl animate-pulse"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">Ready to Join Our Community?</h3>
                  <p className="text-gray-300 mb-4 max-w-xl mx-auto text-base">
                    Connect with fellow CUCEK alumni, unlock new opportunities, and be part of a network that's changing the world.
                  </p>
                  {!user && (
                  <button
                      onClick={() => navigate('/register')}
                      className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/30 text-base"
                  >
                      <span className="mr-2">Join Now</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  )}
                </div>
              </div>
              </motion.div>
            </div>
          </section>

        {/* Alumni Spotlight Section */}
        <section id="spotlight" className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Alumni Spotlight</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Meet Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  Featured Alumni
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-body">
                Discover inspiring stories and achievements from our accomplished graduates
              </p>
            </motion.div>
            
            {/* Spotlight Content */}
            {spotlightsLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              viewport={{ once: true }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading spotlights...</p>
            </motion.div>
            ) : spotlights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              viewport={{ once: true }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Spotlights Yet</h3>
                <p className="text-gray-600">We're working on featuring amazing stories from our alumni community.</p>
              </motion.div>
            ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSpotlightIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Alumni Photo */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                                <OptimizedImage
                                  src={(spotlights[currentSpotlightIndex]?.user?.photoUrl && spotlights[currentSpotlightIndex].user.photoUrl.trim() !== '') 
                                    ? spotlights[currentSpotlightIndex].user.photoUrl 
                                    : defaultImages.placeholderAvatar}
                                  alt={spotlights[currentSpotlightIndex]?.user?.fullName || 'Alumni'}
                                  className="w-full h-full object-cover"
                                  fallbackSrc={defaultImages.placeholderAvatar}
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-bold font-display text-white mb-1">
                                    {spotlights[currentSpotlightIndex]?.user?.fullName || 'Alumni'}
                                  </h3>
                                  <p className="text-primary-400 font-medium text-sm">
                                    {spotlights[currentSpotlightIndex]?.user?.currentJobTitle || 'Professional'}
                                  </p>
                                  <p className="text-secondary-400 text-sm">
                                    {spotlights[currentSpotlightIndex]?.user?.companyName || 'Leading Company'}
                                  </p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                </div>
                              </div>

                              {/* Title */}
                              <h4 className="text-xl font-bold font-display text-white mb-3 leading-tight">
                                {spotlights[currentSpotlightIndex]?.title || 'Success Story'}
                              </h4>

                              {/* Description */}
                              <p className="text-gray-200 leading-relaxed font-body text-sm mb-4">
                                {spotlights[currentSpotlightIndex]?.description || 'An inspiring story of achievement and success.'}
                              </p>

                              {/* Action Button */}
                              {spotlights[currentSpotlightIndex]?.redirectionUrl && (
                                <a
                                  href={spotlights[currentSpotlightIndex].redirectionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold font-body rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm"
                                >
                                  <span className="mr-2">Read More</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    {spotlights.length > 1 && (
                      <div className="flex justify-center mt-6 space-x-2">
                        {spotlights.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSpotlightIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentSpotlightIndex
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125'
                                : 'bg-gray-400 hover:bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
            )}
          </div>
        </section>

        {/* Mission & Values Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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
                <span>Our Mission & Values</span>
                  </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                From CUCEK to the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  World Stage
                    </span>
                </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                Built by CUCEK graduates, for CUCEK graduates. We understand the unique journey from student to industry leader.
              </p>
            </motion.div>

            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto font-medium">
                  To empower CUCEK graduates worldwide by fostering meaningful connections, sharing knowledge, and creating opportunities that accelerate career growth and community impact.
                </p>
                </div>
            </motion.div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                 {
    icon: "🌐",
    title: "Global Impact",
    description: "Thousands of CUCEK alumni are contributing across the globe, driving innovation and excellence in diverse fields.",
    color: "from-primary-500 to-primary-600"
  },
  {
    icon: "🤝",
    title: "Lifelong Connections",
    description: "Building professional and personal relationships that last a lifetime, from campus to career.",
    color: "from-secondary-500 to-secondary-600"
  },
  {
    icon: "🚀",
    title: "Career Support",
    description: "Access opportunities, guidance, and mentorship shared by CUCEK alumni to strengthen your career journey.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: "💡",
    title: "Knowledge Sharing",
    description: "Stay connected with industry insights, best practices, and innovations contributed by alumni experts.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: "🎯",
    title: "CUCEK Identity",
    description: "Celebrating our shared academic journey, engineering heritage, and strong CUCEK community spirit.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: "🌟",
    title: "Community First",
    description: "Supporting each other’s growth while giving back to future CUCEK engineers and innovators.",
    color: "from-orange-500 to-red-600"
  }
              ].map((value, index) => (
                    <motion.div
                      key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full shadow-2xl">
                    <div className={`w-12 h-12 bg-gradient-to-r ${value.color} text-white flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-all duration-300`}>
                      <span className="text-2xl">{value.icon}</span>
                      </div>
                    <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-base text-gray-300 leading-relaxed font-medium">
                      {value.description}
                    </p>
                  </div>
                    </motion.div>
                  ))}
                </div>

            {/* Impact Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 text-white mb-16"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">CUCEK Alumni Making a Difference</h3>
                <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                  Our graduates are leading companies, founding startups, and driving innovation across industries.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                 { number: "10,000+", label: "Graduates Worldwide" },
                 { number: "Global", label: "Alumni Presence" },
                 { number: "Inspiring", label: "Success Stories" },
                 { number: "Strong", label: "Career Outcomes" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold mb-2 text-white">{stat.number}</div>
                    <div className="text-gray-300 text-base font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
                {!user && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                className="text-center"
                  >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join the CUCEK Family?</h3>
                  <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                    Connect with fellow graduates, unlock new opportunities, and be part of a network that's changing the world.
                  </p>
                    <button
                      onClick={() => navigate('/role-selection')}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
                    >
                      <span className="mr-2">🚀 Join Our Community</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                  </button>
                </div>
                  </motion.div>
                )}
          </div>
        </section>


        {/* Clean Modern Footer */}
        <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Content */}
            <div className="pt-16 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand Section */}
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                      CUCEK Alumni Connect
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Empowering CUCEK graduates worldwide through meaningful connections, career opportunities, and lifelong learning.
                  </p>
                  
                  {/* Essential Social Links */}
                  <div className="flex space-x-4">
                    <a href="#" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300" aria-label="LinkedIn">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-300" aria-label="Facebook">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                  <div className="space-y-3">
                    <a href="mailto:info@cucekalumni.org" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      info@cucekalumni.org
                    </a>
                    <a href="tel:+914841234567" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +91 484 123 4567
                    </a>
                    <div className="flex items-start text-gray-300">
                      <svg className="w-4 h-4 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">Cochin University College of Engineering Kuttanadu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700/50 py-6">
              <div className="text-center">
                <p className="text-gray-400">
                  &copy; {new Date().getFullYear()} CUCEK Alumni Connect. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Made with ❤️ for the CUCEK community
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});

export default HomePage;
