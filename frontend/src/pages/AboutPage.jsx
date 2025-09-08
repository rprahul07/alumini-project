import React, { useState, useEffect } from 'react';
import { testimonialsAPI } from '../services/testimonialsService';
import { dashboardAPI } from '../services/dashboardService';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, Link } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mission');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [stats, setStats] = useState({
    alumniCount: 0,
    activeUsers: 0,
    successStories: 0,
    countries: 85
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
          setStats(prevStats => ({
            ...prevStats,
            alumniCount: result.data.totalAlumni || 0,
            activeUsers: result.data.totalUsers || 0,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white py-16 sm:py-20 relative overflow-hidden">
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
            <div className="text-center">
              <div className="mb-8 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-xl text-white border border-white/20 shadow-lg">
                  Est. 1999 • Excellence in Engineering
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Where 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse"> Innovation </span>
                Meets Legacy
              </h1>
              
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Join a network of 15,000+ brilliant minds who are shaping the future across technology, 
                research, entrepreneurship, and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => navigate('/role-selection')}
                  className="group relative px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-primary-50"
                >
                  <span className="relative z-10 flex items-center">
                    <i className="fas fa-users mr-2"></i>
                    Join Our Community
                  </span>
                </button>
                
                <button
                  onClick={() => navigate('/events')}
                  className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Explore Events
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center border border-white/20 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {animatedStats.alumniCount.toLocaleString()}+
                  </div>
                  <div className="text-white/70 text-sm font-medium">Alumni</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center border border-white/20 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {animatedStats.countries}+
                  </div>
                  <div className="text-white/70 text-sm font-medium">Countries</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center border border-white/20 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {animatedStats.successStories}+
                  </div>
                  <div className="text-white/70 text-sm font-medium">Success Stories</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center border border-white/20 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {animatedStats.activeUsers.toLocaleString()}+
                  </div>
                  <div className="text-white/70 text-sm font-medium">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Partners Section */}
        <section className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden animate-slide-up">
          {/* Enhanced Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-300/15 to-secondary-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Global Recognition</span>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight flex items-center justify-center">
                <i className="fas fa-building mr-4 text-primary-400 text-4xl"></i>
                Our Alumni Work at Leading Organizations Worldwide
              </h3>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                From Silicon Valley to Wall Street, our graduates are making their mark at the world's most innovative companies
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-90 hover:opacity-100 transition-opacity duration-300">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="group flex items-center space-x-3 text-2xl hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl border border-white/20 hover:border-white/30">
                  <i className={`${company.logo} ${company.color} text-3xl group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="font-semibold text-white group-hover:text-primary-400 transition-colors duration-300">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Mission/Vision/Values Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden animate-slide-up">
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Our Foundation</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Built on Principles That Guide Us
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                For over two decades, these core values have shaped our community and continue to inspire excellence
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-16">
              <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20">
                {['mission', 'vision', 'values'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-xl font-semibold capitalize transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
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
                <div className="text-center space-y-8 animate-in fade-in duration-500">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <i className="fas fa-bullseye text-white text-3xl"></i>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto font-medium">
                    To create a vibrant ecosystem where CUCEK graduates connect, collaborate, and contribute 
                    to technological advancement and societal progress while maintaining lifelong bonds with 
                    their alma mater.
                  </p>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="text-center space-y-8 animate-in fade-in duration-500">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <i className="fas fa-eye text-white text-3xl"></i>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto font-medium">
                    To be the world's premier engineering alumni network, fostering innovation, 
                    entrepreneurship, and leadership that addresses global challenges and creates 
                    a sustainable future for humanity.
                  </p>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="text-center space-y-8 animate-in fade-in duration-500">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <i className="fas fa-heart text-white text-3xl"></i>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-lightbulb text-white text-xl"></i>
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">Innovation</h4>
                      <p className="text-gray-300 leading-relaxed text-base font-medium">Pushing boundaries and creating solutions that matter</p>
                    </div>
                    <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-handshake text-white text-xl"></i>
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-secondary-400 transition-colors duration-300">Collaboration</h4>
                      <p className="text-gray-300 leading-relaxed text-base font-medium">Building bridges across disciplines and generations</p>
                    </div>
                    <div className="group p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-star text-white text-xl"></i>
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent-400 transition-colors duration-300">Excellence</h4>
                      <p className="text-gray-300 leading-relaxed text-base font-medium">Striving for the highest standards in everything we do</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose CUCEK - Enhanced Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden animate-slide-up">
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Why Choose CUCEK?</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Excellence in Every
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse"> Dimension</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                Discover the unique advantages that make CUCEK the premier choice for engineering education and career success
              </p>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Feature 1 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/30 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-award text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">
                      One of the Top Engineering Colleges in Kerala
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base font-medium mb-6">
                      Constituent college of CUSAT with NBA-accredited programs and research center status since 2017. 
                      Our rigorous academic standards and industry-aligned curriculum ensure you're prepared for real-world challenges.
                    </p>
                    <div className="flex items-center text-primary-400 font-semibold">
                      <span>Learn More</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/30 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-globe-americas text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-secondary-400 transition-colors duration-300">
                      Global Recognition & Alumni Network
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base font-medium mb-6">
                      CUCEK alumni are placed in global companies across 85+ countries. Our strong international reputation 
                      opens doors to opportunities worldwide and connects you with a powerful professional network.
                    </p>
                    <div className="flex items-center text-secondary-400 font-semibold">
                      <span>Explore Network</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

               {/* Feature 3 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/30 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-lightbulb text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent-400 transition-colors duration-300">
                      Innovation Hub
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base font-medium mb-6">
                      CUCEK supports student projects, coding clubs, and startup initiatives with mentorship from alumni and faculty.
                    </p>
                    <div className="flex items-center text-accent-400 font-semibold">
                      <span>Learn More</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

               {/* Feature 4 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/30 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-handshake text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">
                      Strong Network
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base font-medium mb-6">
                     Active alumni support and regular placement drives with leading recruiters.
                    </p>
                    <div className="flex items-center text-primary-400 font-semibold">
                      <span>Learn More</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Video Player Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden animate-slide-up">
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
            <div className="text-center mb-16">
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <i className="fas fa-play text-white text-3xl"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-video text-white text-sm"></i>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-star text-white text-xs"></i>
                  </div>
                </div>
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                  <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                  <span>Our Story</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight flex items-center justify-center">
                  <i className="fas fa-play-circle mr-4 text-primary-400 text-4xl"></i>
                  Discover Our Journey
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
                <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                  Watch our inspiring journey from a small engineering college to a global community of 
                  <span className="font-semibold text-primary-400"> innovators, leaders, and changemakers</span>
                </p>
              </div>
            </div>

            {/* Video Player */}
            <VideoPlayer
              videoId={null} // Will be set when YouTube integration is ready
              title="CUCEK Alumni Network"
              description="Click to play our story"
              duration="5:30 min"
              views="2.5K views"
              year="2024"
              onPlay={() => console.log('Video play clicked')}
              onShare={() => console.log('Video share clicked')}
            />

            {/* Video Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:border-white/30 hover:shadow-3xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-graduation-cap text-white text-xl"></i>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">Alumni Stories</h4>
                <p className="text-gray-300 leading-relaxed text-base font-medium">Real success stories from our graduates</p>
              </div>
              <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:border-white/30 hover:shadow-3xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-lightbulb text-white text-xl"></i>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">Innovation</h4>
                <p className="text-gray-300 leading-relaxed text-base font-medium">Cutting-edge projects and research</p>
              </div>
              <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:border-white/30 hover:shadow-3xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-globe text-white text-xl"></i>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">Global Impact</h4>
                <p className="text-gray-300 leading-relaxed text-base font-medium">Making a difference worldwide</p>
              </div>
            </div>
          </div>
        </section>



        {/* Our Legacy - Redesigned Timeline */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden animate-slide-up">
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
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Our Journey Through Time</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                A Legacy of
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse"> Excellence</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                From humble beginnings to becoming a beacon of engineering excellence, 
                discover the milestones that shaped our remarkable journey
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent rounded-full shadow-lg"></div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                {timelineMilestones.map((milestone, index) => (
                  <div key={index} className="relative group">
                    <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {/* Content Card */}
                      <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/30 overflow-hidden group-hover:border-primary/30">
                          {/* Background Pattern */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full translate-y-12 -translate-x-12"></div>
                          
                          <div className="relative z-10">
                            {/* Year Badge */}
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold mb-4 shadow-lg">
                              <i className="fas fa-calendar-alt mr-2"></i>
                              {milestone.year}
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">
                              {milestone.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-gray-300 leading-relaxed text-base font-medium">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-125 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute inset-0 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Continuing Story</h3>
                  <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
                    Be part of our legacy as we continue to shape the future of engineering education and innovation
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/role-selection')}
                      className="px-8 py-4 bg-white text-primary rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Join Our Community
                    </button>
                    <button
                      onClick={() => navigate('/events')}
                      className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-primary transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Explore Events
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action with Modern Design */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden animate-slide-up">
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

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Ready to Make an Impact?</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight flex items-center justify-center">
                <i className="fas fa-rocket mr-4 text-primary-400 text-4xl"></i>
                Ready to Shape the Future?
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed font-body">
                Join our global community of innovators, entrepreneurs, and leaders who are 
                making a real impact in their fields and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <button
                  onClick={() => navigate('/role-selection')}
                  className="group relative px-10 py-4 bg-white text-primary rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center">
                    <i className="fas fa-user-plus mr-2"></i>
                    Join Alumni Network
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={() => navigate('/events')}
                  className="px-10 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-calendar-check mr-2"></i>
                  Explore Events
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/70">
                <div className="group flex flex-col items-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
                  <i className="fas fa-globe-americas text-3xl mb-3 group-hover:text-primary-400 transition-colors duration-300"></i>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-3">Global Network</h4>
                  <p className="text-gray-300 leading-relaxed text-base font-medium">Connect worldwide</p>
                </div>
                <div className="group flex flex-col items-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
                  <i className="fas fa-lightbulb text-3xl mb-3 group-hover:text-secondary-400 transition-colors duration-300"></i>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-3">Innovation Hub</h4>
                  <p className="text-gray-300 leading-relaxed text-base font-medium">Drive technology forward</p>
                </div>
                <div className="group flex flex-col items-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
                  <i className="fas fa-handshake text-3xl mb-3 group-hover:text-accent-400 transition-colors duration-300"></i>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-3">Lifelong Community</h4>
                  <p className="text-gray-300 leading-relaxed text-base font-medium">Support and growth</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;