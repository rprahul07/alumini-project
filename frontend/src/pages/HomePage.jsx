import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "Marketing Director, TechCorp",
    content:
      "CUCEK Alumni Connect has been instrumental in my career growth. I've connected with industry leaders and found my current job through the network.",
    image: defaultImages.alumni1,
  },
  {
    name: "Michael Chen",
    position: "Software Engineer, Innovate Inc.",
    content:
      "The networking events and mentorship programs have been invaluable. I've gained insights that have directly impacted my professional development.",
    image: defaultImages.alumni2,
  },
  {
    name: "Emily Rodriguez",
    position: "Business Analyst, Global Solutions",
    content:
      "As a recent graduate, this platform has been my gateway to the professional world. The resources and connections have been truly transformative.",
    image: defaultImages.alumni3,
  },
  {
    name: "David Wilson",
    position: "Product Manager, Future Tech",
    content:
      "The alumni network has connected me with mentors who have guided me through challenging career transitions. It's more than just a platform - it's a community.",
    image: defaultImages.alumni4,
  },
];

const filters = [
  "All Features",
  "Networking",
  "Career",
  "Events",
  "Resources",
];

const staticStats = {
  alumniMembers: 15000,
  activeUsers: 5000,
  eventsHosted: 350,
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Features");
  const [stats, setStats] = useState(staticStats);
  const [animatedStats, setAnimatedStats] = useState(staticStats);

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
      <div className="bg-white">
        {/* Hero Section */}
        <section
          className="hero-section pt-20 pb-12 bg-gradient-to-b from-indigo-50 to-white"
          id="home"
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
                  Connect with CUCEK Alumni Worldwide
                </h1>
                <p className="hero-subtitle text-base md:text-lg text-gray-600 mb-6 max-w-xl">
                  Join our growing network of successful graduates and build meaningful connections, share experiences, and explore opportunities together.
                </p>
                {!user && (
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="cta-button bg-[#5A32EA] text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl"
                    aria-label="Sign Up Now"
                  >
                    Sign Up Now
                  </button>
                )}
              </div>
              <div className="lg:w-1/2 mt-6 lg:mt-0 text-center">
                <img
                  src={thirikeImg}
                  alt="CUCEK Alumni Network"
                  className="hero-image w-full max-w-md mx-auto rounded-xl shadow-xl"
                  onError={(e) => handleImageError(e, defaultImages.hero)}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section stats-section py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card bg-white rounded-xl p-6 text-center shadow-md relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#5A32EA]"></div>
                <div className="stat-number text-4xl font-bold text-[#5A32EA] mb-2">
                  {animatedStats.alumniMembers.toLocaleString()}
                </div>
                <div className="stat-label text-sm text-gray-600 uppercase tracking-wider">
                  Alumni Members
                </div>
              </div>
              <div className="stat-card bg-white rounded-xl p-6 text-center shadow-md relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#5A32EA]"></div>
                <div className="stat-number text-4xl font-bold text-[#5A32EA] mb-2">
                  {animatedStats.activeUsers.toLocaleString()}
                </div>
                <div className="stat-label text-sm text-gray-600 uppercase tracking-wider">
                  Active Users
                </div>
              </div>
              <div className="stat-card bg-white rounded-xl p-6 text-center shadow-md relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#5A32EA]"></div>
                <div className="stat-number text-4xl font-bold text-[#5A32EA] mb-2">
                  {animatedStats.eventsHosted.toLocaleString()}
                </div>
                <div className="stat-label text-sm text-gray-600 uppercase tracking-wider">
                  Events Hosted
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="feature-section py-16 bg-[#F5F5F5]" id="features">
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
        <section className="section py-20" id="testimonials">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-12 relative inline-block">
              What Alumni Say
              <span className="absolute left-0 -bottom-3 w-16 h-1 bg-[#5A32EA] rounded"></span>
            </h2>
            <div className="row grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="testimonial-card bg-white rounded-2xl p-8 mb-4 shadow-lg"
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
          </div>
        </section>

        {/* About Section */}
        <section className="section py-20" id="about">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="section-title text-3xl md:text-4xl font-bold mb-8 relative">
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
                    className="cta-button bg-[#5A32EA] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl mt-4"
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
                  <a href="#signup" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Join Now</a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Resources</h5>
                <div className="space-y-4">
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Blog</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Events</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Career Center</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">FAQ</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Support</a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Contact Us</h5>
                <div className="space-y-4">
                  <p className="text-gray-600"><i className="fas fa-envelope mr-2"></i> info@cucekalumni.org</p>
                  <p className="text-gray-600"><i className="fas fa-phone mr-2"></i> +1 (555) 123-4567</p>
                  <p className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i> CUCEK University, Main Campus</p>
                </div>
                <div className="mt-6 space-y-2">
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Privacy Policy</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Terms of Service</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Cookie Policy</a>
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