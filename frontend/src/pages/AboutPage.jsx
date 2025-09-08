import React, { useState, useEffect } from 'react';
import { testimonialsAPI } from '../services/testimonialsService';
import { dashboardAPI } from '../services/dashboardService';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-primary-700 shadow-lg">
                  Est. 1999 • Excellence in Engineering
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Where 
                <span className="bg-gradient-to-r from-accent-400 to-white bg-clip-text text-transparent"> Innovation </span>
                Meets Legacy
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Join a network of 15,000+ brilliant minds who are shaping the future across technology, 
                research, entrepreneurship, and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => navigate('/role-selection')}
                  className="group relative px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-accent-50"
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
                <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {animatedStats.alumniCount.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Alumni</div>
                </div>
                <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {animatedStats.countries}+
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Countries</div>
                </div>
                <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {animatedStats.successStories}+
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Success Stories</div>
                </div>
                <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {animatedStats.activeUsers.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Partners Section */}
        <section className="py-12 bg-gradient-to-r from-primary-50 to-secondary-50 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center">
                <i className="fas fa-building mr-3 text-primary"></i>
                Our alumni work at leading organizations worldwide
              </h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80 hover:opacity-100 transition-opacity duration-300">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="flex items-center space-x-3 text-2xl hover:scale-105 transition-all duration-300 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm hover:shadow-md">
                  <i className={`${company.logo} ${company.color} text-3xl`}></i>
                  <span className="font-semibold text-gray-700">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Mission/Vision/Values Section */}
        <section className="py-16 sm:py-20 bg-white animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Foundation</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built on principles that have guided us for over five decades
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 p-2 rounded-2xl">
                {['mission', 'vision', 'values'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-xl font-semibold capitalize transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
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
                <div className="text-center space-y-6 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-bullseye text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    To create a vibrant ecosystem where CUCEK graduates connect, collaborate, and contribute 
                    to technological advancement and societal progress while maintaining lifelong bonds with 
                    their alma mater.
                  </p>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="text-center space-y-6 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-eye text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    To be the world's premier engineering alumni network, fostering innovation, 
                    entrepreneurship, and leadership that addresses global challenges and creates 
                    a sustainable future for humanity.
                  </p>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="text-center space-y-6 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-heart text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-lightbulb text-primary-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Innovation</h4>
                      <p className="text-sm text-gray-600">Pushing boundaries and creating solutions</p>
                    </div>
                    <div className="p-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-handshake text-primary-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Collaboration</h4>
                      <p className="text-sm text-gray-600">Building bridges across disciplines</p>
                    </div>
                    <div className="p-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-star text-primary-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Excellence</h4>
                      <p className="text-sm text-gray-600">Striving for the highest standards</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose CUCEK - Enhanced Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden animate-slide-up">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-primary/10 text-primary-700 border border-primary/20 mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Why Choose CUCEK?
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Excellence in Every
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"> Dimension</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the unique advantages that make CUCEK the premier choice for engineering education and career success
              </p>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Feature 1 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-award text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                      One of the Top Engineering Colleges in Kerala
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Constituent college of CUSAT with NBA-accredited programs and research center status since 2017. 
                      Our rigorous academic standards and industry-aligned curriculum ensure you're prepared for real-world challenges.
                    </p>
                    <div className="flex items-center text-primary font-semibold">
                      <span>Learn More</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-globe-americas text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-secondary transition-colors duration-300">
                      Global Recognition & Alumni Network
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      CUCEK alumni are placed in global companies across 85+ countries. Our strong international reputation 
                      opens doors to opportunities worldwide and connects you with a powerful professional network.
                    </p>
                    <div className="flex items-center text-secondary font-semibold">
                      <span>Explore Network</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

               {/* Feature 3 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-lightbulb text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-secondary transition-colors duration-300">
                      Innovation Hub
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      CUCEK supports student projects, coding clubs, and startup initiatives with mentorship from alumni and faculty.
                    </p>
                    <div className="flex items-center text-secondary font-semibold">
                      <span>Learn More</span>
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

               {/* Feature 4 - Large Card */}
              <div className="lg:col-span-1 group">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <i className="fas fa-handshake text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-secondary transition-colors duration-300">
                      Strong Network
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                     Active alumni support and regular placement drives with leading recruiters.
                    </p>
                    <div className="flex items-center text-secondary font-semibold">
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
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden relative animate-slide-up">
          {/* Background Decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-primary/10 to-secondary-300/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-secondary-200/30 to-primary/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
                    <i className="fas fa-play text-white text-2xl"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-video text-white text-xs"></i>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-star text-white text-xs"></i>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <i className="fas fa-play-circle mr-3 text-primary"></i>
                  Discover Our Story
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-4"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Watch our inspiring journey from a small engineering college to a global community of 
                  <span className="font-semibold text-primary"> innovators, leaders, and changemakers</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-graduation-cap text-white text-lg"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Alumni Stories</h4>
                <p className="text-sm text-gray-600">Real success stories from our graduates</p>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-white text-lg"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-sm text-gray-600">Cutting-edge projects and research</p>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-globe text-white text-lg"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Global Impact</h4>
                <p className="text-sm text-gray-600">Making a difference worldwide</p>
              </div>
            </div>
          </div>
        </section>



        {/* Our Legacy - Redesigned Timeline */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden animate-slide-up">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-primary/10 text-primary-700 border border-primary/20 mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Our Journey Through Time
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                A Legacy of
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"> Excellence</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                        <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group-hover:border-primary/30">
                          {/* Background Pattern */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full translate-y-12 -translate-x-12"></div>
                          
                          <div className="relative z-10">
                            {/* Year Badge */}
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold mb-4 shadow-lg">
                              <i className="fas fa-calendar-alt mr-2"></i>
                              {milestone.year}
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                              {milestone.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed text-base">
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
              <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Continuing Story</h3>
                  <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
                    Be part of our legacy as we continue to shape the future of engineering education and innovation
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/role-selection')}
                      className="px-8 py-4 bg-white text-primary rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Join Our Community
                    </button>
                    <button
                      onClick={() => navigate('/events')}
                      className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-primary transition-colors duration-200 flex items-center justify-center"
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
        <section className="py-16 sm:py-20 bg-primary relative overflow-hidden animate-slide-up">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
                <i className="fas fa-rocket mr-3"></i>
                Ready to Shape the Future?
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Join our global community of innovators, entrepreneurs, and leaders who are 
                making a real impact in their fields and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                  className="px-10 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-calendar-check mr-2"></i>
                  Explore Events
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
                <div className="flex flex-col items-center">
                  <i className="fas fa-globe-americas text-2xl mb-2"></i>
                  <h4 className="font-semibold text-sm">Global Network</h4>
                  <p className="text-xs">Connect worldwide</p>
                </div>
                <div className="flex flex-col items-center">
                  <i className="fas fa-lightbulb text-2xl mb-2"></i>
                  <h4 className="font-semibold text-sm">Innovation Hub</h4>
                  <p className="text-xs">Drive technology forward</p>
                </div>
                <div className="flex flex-col items-center">
                  <i className="fas fa-handshake text-2xl mb-2"></i>
                  <h4 className="font-semibold text-sm">Lifelong Community</h4>
                  <p className="text-xs">Support and growth</p>
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