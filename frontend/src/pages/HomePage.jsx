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
import SEOHead from '../components/SEOHead';
import AnnouncementNotification from '../components/AnnouncementNotification';
import NewlyJoinedAlumni from '../components/NewlyJoinedAlumni';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load heavy storytelling components for better performance
const StorytellingHero = lazy(() => import('../components/storytelling/StorytellingHero.jsx'));
const JoinNetworkCTA = lazy(() => import('../components/storytelling/JoinNetworkCTA.jsx'));
const MemoryLaneGallery = lazy(() => import('../components/storytelling/MemoryLaneGallery.jsx'));
const LiveStats = lazy(() => import('../components/storytelling/LiveStats.jsx'));
const AnimatedTestimonialRows = lazy(() => import('../components/AnimatedTestimonialRows.jsx'));

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
  hero: "https://i.postimg.cc/z8Yh8P4R/Thirike-1.jpg",
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
      feature.category === activeFilter
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
        <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
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
                <span>What Our Alumni Say</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight font-sans tracking-tight">
                Stories of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Success
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                Discover inspiring stories from our graduates who are making a difference in their fields
              </p>
            </motion.div>
          </div>

          {/* Full-Width Testimonials Animation - Outside Container */}
          {testimonialsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-slate-600 mt-3 text-sm font-sans">Loading testimonials...</p>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-lg" style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">No Testimonials Yet</h3>
              <p className="text-slate-600 text-sm font-sans">Be the first to share your CUCEK experience!</p>
            </div>
          ) : (
            <div className="relative z-10">
              <Suspense fallback={<ComponentLoader />}>
                <AnimatedTestimonialRows testimonials={testimonials} />
              </Suspense>
            </div>
          )}
        </section>

        {/* Our Growth Impact - Live Stats */}
        <Suspense fallback={<ComponentLoader />}>
          <LiveStats statsData={stats} loading={statsLoading} />
        </Suspense>


        {/* Enhanced Features Section */}
        <section id="features" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden" style={{ minHeight: '600px' }}>
          {/* Enhanced Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden" style={{ contain: 'layout' }}>
            {/* Static gradient orbs - no animation to prevent CLS */}
            <div className="gradient-orb absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl"></div>
            <div className="gradient-orb absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl"></div>
            <div className="gradient-orb absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-50/30 to-secondary-50/30 rounded-full blur-3xl"></div>

            {/* Static floating particles - no animation to prevent CLS */}
            <div className="floating-particle absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full"></div>
            <div className="floating-particle absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full"></div>
            <div className="floating-particle absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/40 rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                <span>Why Join CUCEK Alumni Connect</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight font-sans tracking-tight">
                Unlock Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Alumni Potential
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-sans">
                Join thousands of successful CUCEK graduates who are shaping the future through our powerful alumni network
              </p>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-6 flex flex-wrap justify-center gap-2"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 font-sans ${activeFilter === filter
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                    : 'bg-slate-100 backdrop-blur-sm text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 h-full group" style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}>
                      {/* Icon */}
                      <div className="flex items-center justify-center mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} text-white flex items-center justify-center rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md`} style={{
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                          <span className="text-lg">{feature.icon}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 text-center leading-tight font-sans">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-xs text-center font-sans leading-relaxed mb-3">{feature.description}</p>

                      {/* Stats Badge */}
                      <div className="flex justify-center">
                        <span className="text-xs font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-sans tracking-wide">
                          {feature.stats}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>

            {/* Bottom CTA - Only show for non-logged in users */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center mt-8"
              >
                <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 backdrop-blur-xl rounded-2xl p-5 text-slate-900 border border-slate-200 shadow-2xl relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-secondary-100/30 rounded-2xl animate-pulse"></div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3 font-sans">Ready to Join Our Community?</h3>
                    <p className="text-slate-600 mb-4 max-w-xl mx-auto text-sm font-sans">
                      Connect with fellow CUCEK alumni, unlock new opportunities, and be part of a network that's changing the world.
                    </p>
                    <button
                      onClick={() => navigate('/register')}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-transparent text-sm font-sans"
                    >
                      <span className="mr-2">Join Now</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Alumni Spotlight Section */}
        <section id="spotlight" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
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

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                <span>🌟 Alumni Spotlight</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight font-sans tracking-tight">
                Meet Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Featured Alumni
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
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
                className="text-center py-8"
              >
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-slate-500 mt-3 text-sm font-sans">Loading spotlights...</p>
              </motion.div>
            ) : spotlights.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-lg" style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">No Spotlights Yet</h3>
                <p className="text-slate-600 text-sm font-sans">We're working on featuring amazing stories from our alumni community.</p>
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
                    className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group" style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Alumni Photo */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200/50 shadow-md group-hover:border-primary-300 transition-colors duration-300" style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}>
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
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors duration-300 font-sans">
                                {spotlights[currentSpotlightIndex]?.user?.fullName || 'Alumni'}
                              </h3>
                              <p className="text-xs font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-sans tracking-wide">
                                {spotlights[currentSpotlightIndex]?.user?.currentJobTitle || 'Professional'}
                              </p>
                              <p className="text-slate-500 text-xs font-sans">
                                {spotlights[currentSpotlightIndex]?.user?.companyName || 'Leading Company'}
                              </p>
                            </div>
                            <div className="w-5 h-5 bg-gradient-to-r from-secondary-500 to-success-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}>
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm font-bold text-slate-900 mb-2 leading-tight font-sans">
                            {spotlights[currentSpotlightIndex]?.title || 'Success Story'}
                          </h4>

                          {/* Description */}
                          <p className="text-slate-600 text-xs mb-3 font-sans leading-relaxed">
                            {spotlights[currentSpotlightIndex]?.description || 'An inspiring story of achievement and success.'}
                          </p>

                          {/* Action Button */}
                          {spotlights[currentSpotlightIndex]?.redirectionUrl && (
                            <a
                              href={spotlights[currentSpotlightIndex].redirectionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold font-sans rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-xs"
                            >
                              <span className="mr-1.5">Read More</span>
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="flex justify-center mt-4 space-x-2">
                    {spotlights.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSpotlightIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSpotlightIndex
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125'
                          : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>



        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
});

export default HomePage;
