import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { testimonialsAPI } from "../services/testimonialsService";
import { dashboardAPI } from "../services/dashboardService";
import { announcementAPI } from "../services/announcementService";
import "@fortawesome/fontawesome-free/css/all.min.css";
import thirikeImg from '../assets/Thirike.jpg';
import Navbar from '../components/Navbar';

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
    description:
      "Connect with alumni from all over the world and build meaningful professional relationships.",
    category: "Networking",
  },
  {
    icon: "fas fa-briefcase",
    title: "Career Opportunities",
    description:
      "Discover job openings, internships, and mentorship programs from our extensive network.",
    category: "Career",
  },
  {
    icon: "fas fa-calendar-alt",
    title: "Exclusive Events",
    description:
      "Participate in networking events, workshops, and reunions organized by the alumni association.",
    category: "Events",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Knowledge Sharing",
    description:
      "Access a wealth of resources, articles, and insights shared by successful alumni.",
    category: "Resources",
  },
  {
    icon: "fas fa-comments",
    title: "Discussion Forums",
    description:
      "Engage in meaningful discussions with fellow alumni on various topics and industries.",
    category: "Networking",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Continuing Education",
    description:
      "Stay updated with the latest industry trends and access exclusive learning opportunities.",
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
      if (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      ) {
        animateStats();
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [stats]);

  // Fetch testimonials, dashboard stats, and announcements
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await testimonialsAPI.getPublic();
        if (result.success && result.data.length > 0) {
          // Sort testimonials by creation date (latest first) and take the first 4
          const sortedTestimonials = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          // Transform API testimonials to match HomePage format
          const transformedTestimonials = sortedTestimonials.slice(0, 4).map(testimonial => ({
            name: testimonial.user?.fullName || 'Alumni',
            position: `${testimonial.user?.alumni?.currentJobTitle || 'Professional'}, ${testimonial.user?.alumni?.companyName || 'Company'}`,
            content: testimonial.content,
            image: testimonial.user?.photoUrl || defaultImages.alumni1
          }));
          setTestimonials(transformedTestimonials);
        } else {
          // No testimonials available
          setTestimonials([]);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // No testimonials on error
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
          // Take only the first 3 announcements for homepage display
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

  // Image error handler
  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null; // Prevent infinite loop
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
    <>
      <Navbar isHome />
      <div className="bg-gradient-to-r from-indigo-200 to-white">
        {/* Hero Section */}
<section
  className="hero-section p-6 pb-16 lg:px-20 md:pt-16 pt-16 bg-white relative"
  id="home"
>
  <div className="container mx-auto">
    <div className="flex flex-col lg:flex-row items-center">
      <div className="lg:w-full text-center lg:text-left">
        <h1 className="hero-title text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent leading-tight mb-4">
          Connect with CUCEK Alumni Worldwide
        </h1>
        <p className="hero-subtitle text-base md:text-lg text-gray-600 mb-6 max-w-xl">
          Join our growing network of successful graduates and build meaningful connections, share experiences, and explore opportunities together.
        </p>
        {!user && (
          <button
            onClick={() => navigate('/role-selection')}
            className="cta-button bg-[#5A32EA] text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl"
            aria-label="Sign Up Now"
          >
            Sign Up Now
          </button>
        )}
      </div>
      <div className="lg:w-full pt-10 lg:pt-0 md:pt-10 lg:px-10 ">
        <img
          src={thirikeImg}
          alt="CUCEK Alumni Network"
          className="hero-image w-full rounded-xl shadow-xl"
          onError={(e) => handleImageError(e, defaultImages.hero)}
          loading="lazy"
        />
      </div>
    </div>
  </div>
</section>

{/* Stats Section */}
<section className="section py-16 sm:py-20 lg:pt-5 lg:px-10 stats-section -mt-16 z-20 relative">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
          {animatedStats.alumniMembers.toLocaleString()}+
        </div>
        <div className="text-gray-600 text-xs font-medium">Alumni</div>
      </div>
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
          {animatedStats.activeUsers.toLocaleString()}+
        </div>
        <div className="text-gray-600 text-xs font-medium">Active Users</div>
      </div>
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
          {animatedStats.eventsHosted.toLocaleString()}+
        </div>
        <div className="text-gray-600 text-xs font-medium">Events Hosted</div>
      </div>
    </div>
  </div>
</section>

{/* Announcements Section - Compact Design */}
{!announcementsLoading && announcements.length > 0 && (
<section className="py-16 bg-white relative overflow-hidden">
  <div className="container mx-auto px-6 lg:px-20">
    {/* Header */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-indigo-800 mb-4 shadow-sm">
        <i className="fas fa-bullhorn mr-2 text-indigo-600"></i>
        Latest Updates
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Important <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Announcements</span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Stay informed with the latest news from our community
      </p>
    </div>
    
    {/* Announcements Grid - More Compact */}
    <div className="max-w-6xl mx-auto">
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className="group bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <i className="fas fa-bell text-white text-sm"></i>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {announcement.content}
                      </p>
                    </div>
                    
                    {/* Date Badge */}
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
            
            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
)}


        {/* Features Section */}
        <section className="feature-section py-16 sm:py-20 lg:px-20" id="features">
          <div className="container mx-auto px-6">
            <h2 className="section-title text-2xl md:text-3xl font-bold mb-8 relative inline-block">
              Why Join CUCEK Alumni Connect
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-[#5A32EA] rounded"></span>
            </h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`pill-filter px-4 py-1.5 rounded-full border font-medium text-sm transition-all ${
                    activeFilter === filter
                      ? "bg-[#5A32EA] text-white border-[#5A32EA] shadow"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuresData
                .filter(
                  (f) =>
                    activeFilter === "All Features" ||
                    f.category === activeFilter
                )
                .map((feature, idx) => (
                  <div
                    key={idx}
                    className="feature-card bg-white rounded-xl p-6 h-full shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="feature-icon w-12 h-12 bg-[#5A32EA]/10 text-[#5A32EA] flex items-center justify-center mb-4 rounded-full text-xl">
                      <i className={feature.icon}></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section py-16 sm:py-20 lg:px-20" id="testimonials">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="section-title text-3xl font-bold relative inline-block">
                  What Alumni Say
                  <span className="absolute left-0 -bottom-3 w-16 h-1 bg-[#5A32EA] rounded"></span>
                </h2>
              </div>
              
              {/* View All Testimonials Button */}
              <div className="mt-4 sm:mt-0">
                {testimonialsLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A32EA]"></div>
                    <span className="ml-3 text-gray-600">Loading testimonials...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/testimonials')}
                    className="inline-flex items-center px-8 py-4 bg-[#5A32EA] text-white font-semibold rounded-full hover:bg-[#4827b8] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-comments mr-2"></i>
                    <span>View All Testimonials</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                )}
              </div>
            </div>
            
            {testimonialsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A32EA] mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading testimonials...</p>
              </div>
            ) : (
              <div className="row grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="testimonial-card bg-white rounded-2xl p-6 mb-4 shadow-lg"
                  >
                    <div className="testimonial-header flex items-center mb-6">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="testimonial-avatar w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => handleImageError(e, defaultImages.alumni1)}
                        loading="lazy"
                      />
                      <div>
                        <h5 className="testimonial-author font-semibold mb-0">
                          {t.name}
                        </h5>
                        <p className="testimonial-position text-gray-500 text-sm">
                          {t.position}
                        </p>
                      </div>
                    </div>
                    <p className="testimonial-content italic text-gray-600 mb-6">
                      "{t.content}"
                    </p>
                    <span className="status-badge status-active bg-green-100 text-green-600 text-xs px-4 py-2 rounded-full">
                      Active Member
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="section py-16 sm:py-20 lg:px-20" id="about">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="section-title text-3xl font-bold mb-8 relative">
                  About CUCEK Alumni Connect
                  <span className="absolute left-0 -bottom-3 w-16 h-1 bg-[#5A32EA] rounded"></span>
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  CUCEK Alumni Connect is a dedicated platform designed to foster meaningful connections among CUCEK graduates worldwide. We believe that the power of alumni networks lies in shared experiences, knowledge, and opportunities.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Our mission is to create a vibrant community where alumni can:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-3 mb-8">
                  <li className="text-lg">Build professional relationships that last a lifetime</li>
                  <li className="text-lg">Discover career advancement opportunities</li>
                  <li className="text-lg">Access exclusive resources and knowledge</li>
                  <li className="text-lg">Participate in events that celebrate our shared heritage</li>
                  <li className="text-lg">Give back to the university community</li>
                </ul>
                {!user && (
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="cta-button bg-[#5A32EA] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl mt-4"
                    aria-label="Join Our Community"
                  >
                    Join Our Community
                  </button>
                )}
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0">
                <img
                  src={defaultImages.about}
                  alt="About CUCEK Alumni Connect"
                  className="img-fluid rounded-2xl shadow-2xl w-full"
                  onError={(e) => handleImageError(e, defaultImages.about)}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer bg-[#F9F9F9] pt-20 pb-10 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h4 className="footer-title text-xl font-bold mb-6">
                  CUCEK Alumni Connect
                </h4>
                <p className="text-gray-600 mb-6">
                  Connecting CUCEK graduates worldwide to foster professional growth, meaningful relationships, and lifelong learning.
                </p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Quick Links</h5>
                <div className="space-y-4">
                  <a href="#home" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Home</a>
                  <a href="#features" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Features</a>
                  <a href="#testimonials" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Testimonials</a>
                  <a href="#about" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">About</a>
                  <a onClick={() => navigate('/role-selection')} className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Join Now</a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Resources</h5>
                <div className="space-y-4">
                  <a onClick={() => navigate('/events')} className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Events</a>
                  <a onClick={() => navigate('/contact#faq')} className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">FAQ</a>
                  <a href="/contact#support" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Support</a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Contact Us</h5>
                <div className="space-y-4">
                  <a className="footer-link block text-gray-600"><i className="fas fa-envelope mr-2"></i> info@cucekalumni.org</a>
                  <a className="footer-link block text-gray-600"><i className="fas fa-phone mr-2"></i> +1 (555) 123-4567</a>
                  <a href="https://maps.app.goo.gl/EYDX7myXs4M9Nhg27" className="footer-link block text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i> Cochin University College of Engineering Kuttanadu</a>
                </div>
              </div>
            </div>
            <div className="copyright mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} CUCEK Alumni Connect. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage; 