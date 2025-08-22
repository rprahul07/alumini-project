import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { testimonialsAPI } from "../services/testimonialsService";
import { dashboardAPI } from "../services/dashboardService";
import { announcementAPI } from "../services/announcementService";
import "@fortawesome/fontawesome-free/css/all.min.css";
import thirikeImg from '../assets/Thirike.jpg';
import Navbar from '../components/Navbar';
import OptimizedImage from '../components/OptimizedImage';
import AccessibleBadge from '../components/AccessibleBadge';
import SEOHead from '../components/SEOHead';

// Default images in case the remote images fail to load
const defaultImages = {
  hero: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
  about: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  alumni1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
  alumni2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
  alumni3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
  alumni4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop"
};

const featuresData = [
  {
    icon: "fas fa-users",
    title: "Global Network",
    description: "Connect with alumni from all over the world and build meaningful professional relationships.",
    category: "Networking",
  },
  {
    icon: "fas fa-briefcase",
    title: "Career Opportunities",
    description: "Discover job openings, internships, and mentorship programs from our extensive network.",
    category: "Career",
  },
  {
    icon: "fas fa-calendar-alt",
    title: "Exclusive Events",
    description: "Participate in networking events, workshops, and reunions organized by the alumni association.",
    category: "Events",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Knowledge Sharing",
    description: "Access a wealth of resources, articles, and insights shared by successful alumni.",
    category: "Resources",
  },
  {
    icon: "fas fa-comments",
    title: "Discussion Forums",
    description: "Engage in meaningful discussions with fellow alumni on various topics and industries.",
    category: "Networking",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Continuing Education",
    description: "Stay updated with the latest industry trends and access exclusive learning opportunities.",
    category: "Resources",
  },
];

const filters = [
  "All Features",
  "Networking",
  "Career",
  "Events",
  "Resources",
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Features");
  const [stats, setStats] = useState({
    alumniMembers: 0,
    activeUsers: 0,
    eventsHosted: 0,
  });
  const [animatedStats, setAnimatedStats] = useState({
    alumniMembers: 0,
    activeUsers: 0,
    eventsHosted: 0,
  });
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  // Animate stats when in view
  useEffect(() => {
    let animated = false;
    function animateStats() {
      if (animated) return;
      animated = true;
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      const finalValues = stats;
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        setAnimatedStats({
          alumniMembers: Math.floor(finalValues.alumniMembers * progress),
          activeUsers: Math.floor(finalValues.activeUsers * progress),
          eventsHosted: Math.floor(finalValues.eventsHosted * progress),
        });
        if (currentStep === steps) {
          setAnimatedStats(finalValues);
          clearInterval(interval);
        }
      }, stepDuration);
    }
    function onScroll() {
      const section = document.querySelector(".stats-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        animateStats();
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [stats]);

  // Fetch data
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await testimonialsAPI.getPublic();
        if (result.success && result.data.length > 0) {
          const sortedTestimonials = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const transformedTestimonials = sortedTestimonials.slice(0, 4).map(testimonial => ({
            name: testimonial.user?.fullName || 'Alumni',
            position: `${testimonial.user?.alumni?.currentJobTitle || 'Professional'}, ${testimonial.user?.alumni?.companyName || 'Company'}`,
            content: testimonial.content,
            image: testimonial.user?.photoUrl || defaultImages.alumni1
          }));
          setTestimonials(transformedTestimonials);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setTestimonials([]);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const result = await dashboardAPI.getStats();
        if (result.success) {
          setStats({
            alumniMembers: result.data.totalAlumni || 0,
            activeUsers: result.data.totalUsers || 0,
            eventsHosted: result.data.eventscount || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const result = await announcementAPI.getAllAnnouncements();
        if (result.success && result.data.length > 0) {
          setAnnouncements(result.data.slice(0, 3));
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        setAnnouncements([]);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    fetchTestimonials();
    fetchDashboardStats();
    fetchAnnouncements();
  }, []);

  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null;
    e.target.src = fallbackSrc;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead />
      <Navbar isHome />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Connect with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CUCEK Alumni</span>{' '}
                  Worldwide
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Join our growing network of successful graduates and build meaningful connections, share experiences, and explore opportunities together.
                </p>
                {!user && (
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </button>
                )}
              </div>
              <div>
                <OptimizedImage
                  src={thirikeImg}
                  alt="CUCEK Alumni Network"
                  className="w-full rounded-2xl shadow-2xl"
                  fallbackSrc={defaultImages.hero}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16 border-t border-gray-200 stats-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 min-h-[2.5rem] flex items-center justify-center">
                  {animatedStats.alumniMembers.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Alumni Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 min-h-[2.5rem] flex items-center justify-center">
                  {animatedStats.activeUsers.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 min-h-[2.5rem] flex items-center justify-center">
                  {animatedStats.eventsHosted.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Events Hosted</div>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        {!announcementsLoading && announcements.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-indigo-800 mb-4">
                  <i className="fas fa-bullhorn mr-2 text-indigo-600"></i>
                  Latest Updates
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Important <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Announcements</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Stay informed with the latest news from our community
                </p>
              </div>
              
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className="group bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <i className="fas fa-bell text-white text-sm"></i>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                {announcement.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                {announcement.content}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="bg-gray-50 px-3 py-1 rounded-lg border">
                                <span className="text-xs font-medium text-gray-600">
                                  {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CUCEK Alumni Connect</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the benefits of being part of our global alumni network
              </p>
            </div>
            
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresData
                .filter((f) => activeFilter === "All Features" || f.category === activeFilter)
                .map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center mb-4 rounded-xl group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                      <i className={feature.icon}></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Alumni Say</span>
                </h2>
                <p className="text-lg text-gray-600">Hear from our successful graduates</p>
              </div>
              <div className="mt-4 sm:mt-0">
                {testimonialsLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading testimonials...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/testimonials')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-comments mr-2"></i>
                    View All Testimonials
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                )}
              </div>
            </div>
            
            {testimonialsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading testimonials...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => handleImageError(e, defaultImages.alumni1)}
                        loading="lazy"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic mb-6">
                      "{testimonial.content}"
                    </p>
                    <AccessibleBadge variant="active">
                      Active Member
                    </AccessibleBadge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CUCEK Alumni Connect</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  CUCEK Alumni Connect is a dedicated platform designed to foster meaningful connections among CUCEK graduates worldwide. We believe that the power of alumni networks lies in shared experiences, knowledge, and opportunities.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Our mission is to create a vibrant community where alumni can:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <i className="fas fa-check text-indigo-600 mt-1 mr-3"></i>
                    <span className="text-gray-600">Build professional relationships that last a lifetime</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-indigo-600 mt-1 mr-3"></i>
                    <span className="text-gray-600">Discover career advancement opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-indigo-600 mt-1 mr-3"></i>
                    <span className="text-gray-600">Access exclusive resources and knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-indigo-600 mt-1 mr-3"></i>
                    <span className="text-gray-600">Participate in events that celebrate our shared heritage</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-indigo-600 mt-1 mr-3"></i>
                    <span className="text-gray-600">Give back to the university community</span>
                  </li>
                </ul>
                {!user && (
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Join Our Community
                  </button>
                )}
              </div>
              <div>
                <img
                  src={defaultImages.about}
                  alt="About CUCEK Alumni Connect"
                  className="w-full rounded-2xl shadow-2xl"
                  onError={(e) => handleImageError(e, defaultImages.about)}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-6">
                  CUCEK Alumni Connect
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Connecting CUCEK graduates worldwide to foster professional growth, meaningful relationships, and lifelong learning.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-300">Home</a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-300">Features</a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-300">Testimonials</a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-300">About</a>
                  <a onClick={() => navigate('/role-selection')} className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">Join Now</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Resources</h3>
                <div className="space-y-3">
                  <a onClick={() => navigate('/events')} className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">Events</a>
                  <a onClick={() => navigate('/contact')} className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">FAQ</a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-300">Support</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <i className="fas fa-envelope mr-3"></i>
                    <span>info@cucekalumni.org</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <i className="fas fa-phone mr-3"></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start text-gray-300">
                    <i className="fas fa-map-marker-alt mr-3 mt-1"></i>
                    <span>Cochin University College of Engineering Kuttanadu</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              &copy; {new Date().getFullYear()} CUCEK Alumni Connect. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
