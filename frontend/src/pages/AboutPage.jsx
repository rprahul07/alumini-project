import React, { useState, useEffect, memo } from 'react';
import { testimonialsAPI } from '../services/testimonialsService';
import { dashboardAPI } from '../services/dashboardService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoPlayer from '../components/VideoPlayer';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const AboutPage = memo(() => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('mission');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [stats, setStats] = useState({
    alumniCount: 0,
    activeUsers: 0,
    successStories: 0,
    countries: 45
  });
  const [animatedStats, setAnimatedStats] = useState({
    alumniCount: 0,
    activeUsers: 0,
    successStories: 0,
    countries: 0
  });


  // Animate stats on component mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        alumniCount: Math.floor(stats.alumniCount * progress),
        activeUsers: Math.floor(stats.activeUsers * progress),
        successStories: Math.floor(stats.successStories * progress),
        countries: Math.floor(stats.countries * progress),
      });

      if (currentStep === steps) {
        setAnimatedStats(stats);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);



  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fetch testimonials and dashboard stats
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await testimonialsAPI.getPublic();
        if (result.success && result.data.length > 0) {
          // Transform API testimonials to match AboutPage format
          const transformedTestimonials = result.data.slice(0, 6).map((testimonial, index) => ({
            id: testimonial.id,
            name: testimonial.user?.fullName || 'Alumni',
            batch: testimonial.user?.alumni?.graduationYear?.toString() || '2020',
            department: testimonial.user?.department || 'Unknown Department',
            position: testimonial.user?.alumni?.currentJobTitle || 'Professional',
            company: testimonial.user?.alumni?.companyName || 'Company',
            image: testimonial.user?.photoUrl || `https://images.unsplash.com/photo-${1494790108377 + index}?w=150&h=150&fit=crop`,
            quote: testimonial.content,
            rating: 5,
            location: 'India'
          }));
          setTestimonials(transformedTestimonials);

          // Update success stories count with actual testimonials count
          setStats(prevStats => ({
            ...prevStats,
            successStories: result.data.length
          }));
        } else {
          // No testimonials available
          setTestimonials([]);
        }
      } catch (error) {
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
          setStats(prevStats => ({
            ...prevStats,
            alumniCount: result.data.totalAlumni || 0,
            activeUsers: result.data.totalUsers || 0,
          }));
        }
      } catch (error) {
      }
    };



    fetchTestimonials();
    fetchDashboardStats();
  }, []);


  // Company logos for credibility
  const partnerCompanies = [
    { name: 'Google', logo: 'fab fa-google', color: 'text-red-500' },
    { name: 'Microsoft', logo: 'fab fa-microsoft', color: 'text-blue-600' },
    { name: 'Apple', logo: 'fab fa-apple', color: 'text-gray-800' },
    { name: 'Amazon', logo: 'fab fa-amazon', color: 'text-orange-500' },
    { name: 'Meta', logo: 'fab fa-meta', color: 'text-blue-700' },
    { name: 'IBM', logo: 'fas fa-cube', color: 'text-blue-800' }
  ];

  // University achievements and milestones
  const achievements = [
    {
      icon: 'fas fa-award',
      title: 'One of the Top Engineering Colleges in Kerala',
      description: 'Constituent college of CUSAT with NBA-accredited programs and research center status since 2017.',
      color: 'from-amber-400 to-orange-400'
    },
    {
      icon: 'fas fa-globe-americas',
      title: 'Global Recognition',
      description: 'CUCEK alumni work in global companies across 45+ countries, offering worldwide opportunities and a strong professional network.',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation Hub',
      description: 'CUCEK supports student projects, coding clubs, and startup initiatives with mentorship from alumni and faculty.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Strong Network',
      description: 'Active alumni support and regular placement drives with leading recruiters.',
      color: 'from-green-400 to-emerald-400'
    }
  ];


  // University timeline milestones
  const timelineMilestones = [
    {
      year: '1999',
      title: 'Established',
      description: 'CUCEK was founded in October 1999 as the rural engineering campus of CUSAT at Pulincunnu, Kuttanad.'
    },
    {
      year: 'Early 2000s',
      title: 'Academic Expansion',
      description: 'Introduced multiple B.Tech programs—Civil, CSE, IT, ECE, EEE & Mechanical Engineering—and MCA with structured intake.'
    },
    {
      year: '2017',
      title: 'Researched Designation',
      description: 'Elevated to a CUSAT Research Centre, supporting doctoral studies under nine supervisors.'
    },
    {
      year: '2018',
      title: 'Alumni Engagement',
      description: 'Launched the official alumni connect platform for networking, mentoring, and community building.'
    },
    {
      year: '2020',
      title: 'Digital Transition',
      description: 'Adopted online classes and virtual labs in line with COVID‑19 adaptations across Kerala’s higher education.'
    },
    {
      year: '2025',
      title: 'Placement Milestone',
      description: 'Placement activity gained visibility with top packages up to ₹29.17 LPA and average placements around ₹3.3 LPA.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden pt-16">

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

        {/* Hero Section */}
        <section className="relative z-10 py-16 md:py-24">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm text-slate-700 font-sans">
                  <span className="flex h-2 w-2 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  Est. 1999 • Excellence in Engineering
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans text-slate-900 mb-6 leading-tight tracking-tight"
              >
                Where
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse"> Innovation </span>
                Meets Legacy
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans mb-10"
              >
                Join a network of 15,000+ brilliant minds who are shaping the future across technology,
                research, entrepreneurship, and beyond.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                {!user && !loading && (
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="group relative px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-primary-600 hover:to-secondary-600 text-xs font-sans"
                  >
                    <span className="relative z-10 flex items-center">
                      <i className="fas fa-users mr-2 text-xs"></i>
                      Join Our Community
                    </span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/events')}
                  className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 flex items-center text-xs font-sans"
                >
                  <i className="fas fa-calendar-alt mr-2 text-xs"></i>
                  Explore Events
                </button>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6"
              >
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 text-center border border-slate-200/50 shadow-lg hover:shadow-xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 group" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="text-lg font-bold text-slate-900 mb-1 font-sans leading-tight">
                    {animatedStats.alumniCount.toLocaleString()}+
                  </div>
                  <div className="text-slate-600 text-xs font-semibold font-sans">Alumni</div>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 text-center border border-slate-200/50 shadow-lg hover:shadow-xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 group" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="text-lg font-bold text-slate-900 mb-1 font-sans leading-tight">
                    {animatedStats.countries}+
                  </div>
                  <div className="text-slate-600 text-xs font-semibold font-sans">Countries</div>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 text-center border border-slate-200/50 shadow-lg hover:shadow-xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 group" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="text-lg font-bold text-slate-900 mb-1 font-sans leading-tight">
                    {animatedStats.successStories}+
                  </div>
                  <div className="text-slate-600 text-xs font-semibold font-sans">Success Stories</div>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 text-center border border-slate-200/50 shadow-lg hover:shadow-xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 group" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="text-lg font-bold text-slate-900 mb-1 font-sans leading-tight">
                    {animatedStats.activeUsers.toLocaleString()}+
                  </div>
                  <div className="text-slate-600 text-xs font-semibold font-sans">Active Users</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Company Partners Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
        >
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span>Global Recognition</span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-900 mb-6 leading-tight text-center tracking-tight">
                <div className="flex items-center justify-center mb-4">
                  <i className="fas fa-building mr-3 text-primary-500 text-4xl"></i>
                </div>
                Our Alumni Work at{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                  Leading Organizations
                </span>{' '}
                Worldwide
              </h3>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans mb-10">
                From Silicon Valley to Wall Street, our graduates are making their mark at the world's most innovative companies
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 opacity-90 hover:opacity-100 transition-opacity duration-300">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="group flex items-center space-x-2 text-sm hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/50 hover:border-primary-300 min-w-[160px] transform hover:-translate-y-1" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <i className={`${company.logo} ${company.color} text-lg group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-300 font-sans text-xs">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Interactive Mission/Vision/Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
        >
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span>Our Foundation</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-900 mb-6 leading-tight tracking-tight">
                Built on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                  Principles
                </span>{' '}
                That Guide Us
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                For over two decades, these core values have shaped our community and continue to inspire excellence
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/50 shadow-lg">
                {['mission', 'vision', 'values'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl font-semibold capitalize transition-all duration-300 text-sm font-sans ${activeTab === tab
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl mx-auto">
              {activeTab === 'mission' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <i className="fas fa-bullseye text-white text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 font-sans">
                    Our{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                      Mission
                    </span>
                  </h3>
                  <p className="text-sm text-slate-600 max-w-4xl mx-auto font-sans leading-relaxed">
                    To create a vibrant ecosystem where CUCEK graduates connect, collaborate, and contribute
                    to technological advancement and societal progress while maintaining lifelong bonds with
                    their alma mater.
                  </p>
                </motion.div>
              )}

              {activeTab === 'vision' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <i className="fas fa-eye text-white text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 font-sans">
                    Our{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                      Vision
                    </span>
                  </h3>
                  <p className="text-sm text-slate-600 max-w-4xl mx-auto font-sans leading-relaxed">
                    To be the world's premier engineering alumni network, fostering innovation,
                    entrepreneurship, and leadership that addresses global challenges and creates
                    a sustainable future for humanity.
                  </p>
                </motion.div>
              )}

              {activeTab === 'values' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <i className="fas fa-heart text-white text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 font-sans">
                    Our{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                      Values
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group p-5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 hover:border-primary-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1" style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}>
                      <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-lightbulb text-white text-lg"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 font-sans">Innovation</h4>
                      <p className="text-slate-600 text-xs font-sans leading-relaxed">Pushing boundaries and creating solutions that matter</p>
                    </div>
                    <div className="group p-5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 hover:border-primary-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1" style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}>
                      <div className="w-14 h-14 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-handshake text-white text-lg"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-secondary-600 transition-colors duration-300 font-sans">Collaboration</h4>
                      <p className="text-slate-600 text-xs font-sans leading-relaxed">Building bridges across disciplines and generations</p>
                    </div>
                    <div className="group p-5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 hover:border-primary-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1" style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}>
                      <div className="w-14 h-14 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-star text-white text-lg"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-accent-600 transition-colors duration-300 font-sans">Excellence</h4>
                      <p className="text-slate-600 text-xs font-sans leading-relaxed">Striving for the highest standards in everything we do</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Why Choose CUCEK - Enhanced Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
        >
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span>Why Choose CUCEK?</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-900 mb-6 leading-tight tracking-tight">
                Excellence in Every
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse"> Dimension</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                Discover the unique advantages that make CUCEK the premier choice for engineering education and career success
              </p>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Feature 1 - Large Card */}
              <div className="group">
                <div
                  className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-slate-200/50 hover:border-primary-300 overflow-hidden h-full"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent-100/30 to-primary-100/30 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                      <i className="fas fa-award text-white text-sm"></i>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 font-sans">
                      One of the Top{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                        Engineering Colleges
                      </span>{' '}
                      in Kerala
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-xs font-sans flex-grow">
                      Constituent college of CUSAT with NBA-accredited programs and research center status since 2017.
                      Our rigorous academic standards and industry-aligned curriculum ensure you're prepared for real-world challenges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Large Card */}
              <div className="group">
                <div
                  className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-slate-200/50 hover:border-primary-300 overflow-hidden h-full"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary-100/30 to-accent-100/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary-100/30 to-secondary-100/30 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                      <i className="fas fa-globe-americas text-white text-sm"></i>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-2 group-hover:text-secondary-600 transition-colors duration-300 font-sans">
                      Global Recognition &{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                        Alumni Network
                      </span>
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-xs font-sans flex-grow">
                      CUCEK alumni are placed in global companies across 85+ countries. Our strong international reputation
                      opens doors to opportunities worldwide and connects you with a powerful professional network.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Large Card */}
              <div className="group">
                <div
                  className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-slate-200/50 hover:border-primary-300 overflow-hidden h-full"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-100/30 to-primary-100/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary-100/30 to-accent-100/30 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                      <i className="fas fa-lightbulb text-white text-sm"></i>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-2 group-hover:text-accent-600 transition-colors duration-300 font-sans">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                        Innovation
                      </span>{' '}
                      Hub
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-xs font-sans flex-grow">
                      CUCEK supports student projects, coding clubs, and startup initiatives with mentorship from alumni and faculty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 - Large Card */}
              <div className="group">
                <div
                  className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-slate-200/50 hover:border-primary-300 overflow-hidden h-full"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary-100/30 to-primary-100/30 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                      <i className="fas fa-handshake text-white text-sm"></i>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 font-sans">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                        Strong
                      </span>{' '}
                      Network
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-xs font-sans flex-grow">
                      Active alumni support and regular placement drives with leading recruiters.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.section>

        {/* Video Player Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
        >
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

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <i className="fas fa-play text-white text-lg"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-video text-white text-xs"></i>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-star text-white text-xs"></i>
                  </div>
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
                  <span className="flex h-2 w-2 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  <span>Our Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-slate-900 mb-6 leading-tight flex items-center justify-center tracking-tight">
                  <i className="fas fa-play-circle mr-3 text-primary-500 text-3xl"></i>
                  Discover Our{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                    Journey
                  </span>
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6"></div>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
                  Watch our inspiring journey from a small engineering college to a global community of
                  <span className="font-semibold text-primary-600"> innovators, leaders, and changemakers</span>
                </p>
              </div>
            </div>

            {/* Video Player */}
            <VideoPlayer
              videoId="R_hQzJ0jRqE" // YouTube video ID from the provided URL
              title="More than a college — it's family"
              description="Discover how our graduates are making a difference in technology, innovation, and society worldwide"
              duration="5:30 min"
              views="2.5K views"
              year="2024"
              muted={true} // Play without sound by default
              autoplay={false} // Don't autoplay, let user control
              loop={false} // Don't loop the video
              onPlay={() => { }}
              onShare={() => { }}
            />

            {/* Video Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div className="group text-center p-5 bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}>
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <i className="fas fa-graduation-cap text-white text-sm"></i>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Alumni Stories</h4>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">Real success stories from our graduates</p>
              </div>
              <div className="group text-center p-5 bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}>
                <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <i className="fas fa-lightbulb text-white text-sm"></i>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Innovation</h4>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">Cutting-edge projects and research</p>
              </div>
              <div className="group text-center p-5 bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}>
                <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <i className="fas fa-globe text-white text-sm"></i>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Global Impact</h4>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">Making a difference worldwide</p>
              </div>
            </div>
          </div>
        </motion.section>



        {/* Our Legacy - Redesigned Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
        >
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

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg font-sans">
                <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                <span>Our Journey Through Time</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-slate-900 mb-3 leading-tight">
                A Legacy of
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse"> Excellence</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                From humble beginnings to becoming a beacon of engineering excellence,
                discover the milestones that shaped our remarkable journey
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-primary-500 via-secondary-500 to-accent-500 rounded-full shadow-lg"></div>

              {/* Timeline Items */}
              <div className="space-y-12">
                {timelineMilestones.map((milestone, index) => (
                  <div key={index} className="relative group">
                    <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {/* Content Card */}
                      <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-6' : 'lg:pl-6'}`}>
                        <div
                          className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-slate-200/50 hover:border-primary-300 overflow-hidden group-hover:border-primary-300"
                          style={{
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          {/* Background Pattern */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 rounded-full -translate-y-12 translate-x-12"></div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent-100/30 to-primary-100/30 rounded-full translate-y-10 -translate-x-10"></div>

                          <div className="relative z-10">
                            {/* Year Badge */}
                            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold mb-2 shadow-lg font-sans">
                              <i className="fas fa-calendar-alt mr-1.5 text-xs"></i>
                              {milestone.year}
                            </div>

                            {/* Title */}
                            <h3 className="text-xs font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 font-sans">
                              {milestone.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-600 leading-relaxed text-xs font-sans">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
                        <div className="relative">
                          <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full border-2 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute inset-0 w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-5 text-white relative overflow-hidden shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 font-sans">Join Our Continuing Story</h3>
                  <p className="text-white/90 text-xs max-w-2xl mx-auto mb-4 font-sans leading-relaxed">
                    Be part of our legacy as we continue to shape the future of engineering education and innovation
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {!user && !loading && (
                      <button
                        onClick={() => navigate('/role-selection')}
                        className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl text-xs font-sans"
                      >
                        <i className="fas fa-user-plus mr-2 text-xs"></i>
                        Join Our Community
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/events')}
                      className="px-5 py-2.5 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl text-xs font-sans"
                    >
                      <i className="fas fa-calendar-alt mr-2 text-xs"></i>
                      Explore Events
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action with Modern Design */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
        >
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

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-6 shadow-lg font-sans">
                <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                <span>Ready to Make an Impact?</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-slate-900 mb-3 leading-tight flex items-center justify-center">
                <i className="fas fa-rocket mr-3 text-primary-500 text-2xl"></i>
                Ready to Shape the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                  Future
                </span>?
              </h2>
              <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed font-sans">
                Join our global community of innovators, entrepreneurs, and leaders who are
                making a real impact in their fields and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                {!user && !loading && (
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="group relative px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold text-xs overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-primary-600 hover:to-secondary-600 font-sans"
                  >
                    <span className="relative z-10 flex items-center">
                      <i className="fas fa-user-plus mr-2 text-xs"></i>
                      Join Alumni Network
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}

                <button
                  onClick={() => navigate('/events')}
                  className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold text-xs hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl font-sans"
                >
                  <i className="fas fa-calendar-check mr-2 text-xs"></i>
                  Explore Events
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-600">
                <div className="group flex flex-col items-center p-5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <i className="fas fa-globe-americas text-2xl mb-3 group-hover:text-primary-600 transition-colors duration-300"></i>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Global Network</h4>
                  <p className="text-slate-600 text-xs font-sans leading-relaxed">Connect worldwide</p>
                </div>
                <div className="group flex flex-col items-center p-5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <i className="fas fa-lightbulb text-2xl mb-3 group-hover:text-secondary-600 transition-colors duration-300"></i>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Innovation Hub</h4>
                  <p className="text-slate-600 text-xs font-sans leading-relaxed">Drive technology forward</p>
                </div>
                <div className="group flex flex-col items-center p-5 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1" style={{
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  <i className="fas fa-handshake text-2xl mb-3 group-hover:text-accent-600 transition-colors duration-300"></i>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 font-sans">Lifelong Community</h4>
                  <p className="text-slate-600 text-xs font-sans leading-relaxed">Support and growth</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
});

export default AboutPage;