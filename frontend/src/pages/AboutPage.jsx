import React, { useState, useEffect } from 'react';
import { testimonialsAPI } from '../services/testimonialsService';
import { dashboardAPI } from '../services/dashboardService';
import { galleryAPI } from '../services/galleryService';
import { spotlightAPI } from '../services/spotlightService';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, Link } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mission');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [spotlights, setSpotlights] = useState([]);
  const [spotlightsLoading, setSpotlightsLoading] = useState(true);
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

  // Use only dynamic spotlights data
  const successStories = spotlights;

  // Auto-rotate success stories
  useEffect(() => {
    if (successStories.length === 0) return; // Don't start rotation if no stories
    
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [successStories.length]); // Add dependency on successStories.length

  // Auto-rotate gallery
  useEffect(() => {
    if (galleryImages.length === 0) return; // Don't start rotation if no images
    
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]); // Add dependency on galleryImages.length

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

    const fetchGallery = async () => {
      try {
        const result = await galleryAPI.getGallery();
        if (result.success && result.data.length > 0) {
          // Transform API gallery to match AboutPage format
          const transformedGallery = result.data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            image: item.imageUrl,
            redirectionUrl: item.redirectionUrl
          }));
          setGalleryImages(transformedGallery);
        } else {
          // Fallback to a default image if no gallery items
          setGalleryImages([
            {
              id: 1,
              title: 'CUCEK Campus',
              description: 'Beautiful campus of Cochin University College of Engineering Kuttanad',
              image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        // Fallback to default image on error
        setGalleryImages([
          {
            id: 1,
            title: 'CUCEK Campus',
            description: 'Beautiful campus of Cochin University College of Engineering Kuttanad',
            image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop'
          }
        ]);
      } finally {
        setGalleryLoading(false);
      }
    };

    const fetchSpotlights = async () => {
      try {
        const result = await spotlightAPI.getAllSpotlights();
        if (result.success && result.data.length > 0) {
          // Transform API spotlights to match AboutPage successStories format
          const transformedSpotlights = result.data.map((spotlight) => ({
            id: spotlight.id,
            name: spotlight.user?.fullName || 'Alumni',
            batch: spotlight.user?.alumni?.graduationYear || '2020',
            department: spotlight.user?.department || 'Engineering',
            position: spotlight.user?.alumni?.currentJobTitle || 'Professional',
            company: spotlight.user?.alumni?.companyName || 'Leading Company',
            image: spotlight.user?.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            achievement: spotlight.title,
            impact: spotlight.description || 'Making a significant impact',
            color: 'from-purple-500 to-pink-500',
            redirectionUrl: spotlight.redirectionUrl
          }));
          setSpotlights(transformedSpotlights);
          
          // Update success stories count with actual spotlights count
          setStats(prevStats => ({
            ...prevStats,
            successStories: result.data.length
          }));
        } else {
          // No spotlights available - set empty array
          setSpotlights([]);
        }
      } catch (error) {
        console.error('Failed to fetch spotlights:', error);
        // Set empty array on error
        setSpotlights([]);
      } finally {
        setSpotlightsLoading(false);
      }
    };

    fetchTestimonials();
    fetchDashboardStats();
    fetchGallery();
    fetchSpotlights();
  }, []);

  // Reset story index when successStories changes to prevent blank slides
  useEffect(() => {
    if (successStories.length > 0 && currentStoryIndex >= successStories.length) {
      setCurrentStoryIndex(0);
    }
  }, [successStories, currentStoryIndex]);

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
    description: 'CUCEK alumni are placed in global companies.',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    icon: 'fas fa-lightbulb',
    title: 'Innovation Hub',
    description: 'Encourages student projects, coding clubs, and startup mentorship through alumni and faculty.',
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
      <div className="min-h-screen bg-white">
      {/* Dynamic Hero Section with Floating Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-200 to-white">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>
          
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm text-indigo-800 mb-6 shadow-lg">
                Est. 1999 • Excellence in Engineering
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Where 
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"> Innovation </span>
              Meets Legacy
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join a network of 15,000+ brilliant minds who are shaping the future across technology, 
              research, entrepreneurship, and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/role-selection')}
                className="group relative px-8 py-4 bg-[#5A32EA] text-white rounded-2xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#4827b8]"
              >
                <span className="relative z-10 flex items-center">
                  <i className="fas fa-users mr-2"></i>
                  Join Our Community
                </span>
              </button>
              
              <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 border-2 border-[#5A32EA] text-[#5A32EA] rounded-2xl font-semibold hover:bg-[#5A32EA] hover:text-white transition-all duration-300 flex items-center"
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Explore Events
              </button>
            </div>

            {/* Floating Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
                  {animatedStats.alumniCount.toLocaleString()}+
                </div>
                <div className="text-gray-600 text-xs font-medium">Alumni</div>
              </div>
              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
                  {animatedStats.countries}+
                </div>
                <div className="text-gray-600 text-xs font-medium">Countries</div>
              </div>
              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
                  {animatedStats.successStories}+
                </div>
                <div className="text-gray-600 text-xs font-medium">Success Stories</div>
              </div>
              <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 text-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-[#5A32EA] mb-1">
                  {animatedStats.activeUsers.toLocaleString()}+
                </div>
                <div className="text-gray-600 text-xs font-medium">Active Users</div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
            <div className="w-6 h-10 border-2 border-indigo-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-indigo-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Company Partners Section */}
        <section className="py-12 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center">
                <i className="fas fa-building mr-3 text-[#5A32EA]"></i>
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
        <section className="py-16 sm:py-20 bg-white">
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
                        ? 'bg-[#5A32EA] text-white shadow-lg'
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
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-heart text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-lightbulb text-indigo-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Innovation</h4>
                      <p className="text-sm text-gray-600">Pushing boundaries and creating solutions</p>
                    </div>
                    <div className="p-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-handshake text-indigo-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Collaboration</h4>
                      <p className="text-sm text-gray-600">Building bridges across disciplines</p>
                    </div>
                    <div className="p-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-star text-indigo-600"></i>
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

        {/* Achievements Grid */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <i className="fas fa-star mr-4 text-[#5A32EA]"></i>
                Why Choose CUCEK?
              </h2>
              <p className="text-lg text-gray-600">Discover what makes our community exceptional</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-[#5A32EA]/30 aspect-square flex flex-col items-center justify-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-r ${achievement.color} shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <i className={`${achievement.icon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#5A32EA] transition-colors duration-300 leading-tight">{achievement.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Gallery Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#5A32EA]/10 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-indigo-200/30 to-[#5A32EA]/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Gallery Header - Consistent with Project Style */}
            <div className="text-center mb-12">
              <div className="flex flex-col items-center">
                {/* Main Icon with Consistent Design */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#5A32EA] to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
                    <i className="fas fa-images text-white text-2xl"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-heart text-white text-xs"></i>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-star text-white text-xs"></i>
                  </div>
                </div>
                
                {/* Title Section - Matching Project Typography */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <i className="fas fa-camera-retro mr-3 text-[#5A32EA]"></i>
                  Campus Life Gallery
                </h2>
                
                {/* Divider Line */}
                <div className="w-16 h-1 bg-gradient-to-r from-[#5A32EA] to-purple-600 rounded-full mb-4"></div>
                
                {/* Description - Consistent with Other Sections */}
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
                  Experience the vibrant moments that define our community through a visual journey of 
                  <span className="font-semibold text-[#5A32EA]"> innovation, excellence, and shared memories</span>
                </p>
                
                {/* Category Tags - Matching Project Button Style */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white/40 hover:shadow-md transition-all duration-300">
                    <i className="fas fa-graduation-cap text-[#5A32EA] text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">Campus Life</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white/40 hover:shadow-md transition-all duration-300">
                    <i className="fas fa-users text-purple-500 text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">Events</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white/40 hover:shadow-md transition-all duration-300">
                    <i className="fas fa-trophy text-amber-500 text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">Achievements</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white/40 hover:shadow-md transition-all duration-300">
                    <i className="fas fa-lightbulb text-green-500 text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">Innovation</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {galleryLoading ? (
                /* Loading State */
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-xl bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block w-5 h-5 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading gallery...</p>
                  </div>
                </div>
              ) : galleryImages.length === 0 ? (
                /* Empty State */
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-images text-3xl text-gray-400 mb-2"></i>
                    <p className="text-base text-gray-600">No gallery images available</p>
                  </div>
                </div>
              ) : (
                /* Gallery Content */
                <>
              {/* Main Gallery Display */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={image.id} className="w-full flex-shrink-0 relative">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                        <img
                          src={image.image}
                          alt={image.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg md:text-xl font-bold mb-1 text-white drop-shadow-lg">{image.title}</h3>
                          <p className="text-sm text-gray-100 drop-shadow-md">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-[#5A32EA]/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-[#5A32EA]/40 transition-all duration-300 group"
                >
                  <i className="fas fa-chevron-left group-hover:scale-110 transition-transform duration-300 text-sm"></i>
                </button>
                <button
                  onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#5A32EA]/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-[#5A32EA]/40 transition-all duration-300 group"
                >
                  <i className="fas fa-chevron-right group-hover:scale-110 transition-transform duration-300 text-sm"></i>
                </button>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="flex justify-center mt-6 mb-4 space-x-2 overflow-x-auto pb-6 px-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-300 relative ${
                      index === currentGalleryIndex 
                        ? 'ring-3 ring-[#5A32EA] ring-opacity-60 scale-105 z-10 mx-1' 
                        : 'opacity-70 hover:opacity-100 hover:scale-100 mx-0.5'
                    }`}
                  >
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop';
                      }}
                    />
                  </button>
                ))}
              </div>
              
              {/* Progress Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`transition-all duration-300 ${
                      index === currentGalleryIndex 
                        ? 'w-6 h-2 bg-[#5A32EA] rounded-full' 
                        : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              </>
            )}
          </div>
        </div>
      </section>

        {/* Alumni Testimonials Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <i className="fas fa-quote-left mr-3 text-[#5A32EA]"></i>
                What Our Alumni Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from graduates who are making their mark across the globe
              </p>
            </div>
            
            <div className="relative overflow-hidden">
              {/* Main Testimonial Display */}
              <div className="relative">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                      <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-6 md:p-8 relative overflow-hidden min-h-[350px] md:min-h-[400px] border border-indigo-100">
                          {/* Decorative Elements */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#5A32EA]/10 to-purple-200/20 rounded-full -translate-y-12 translate-x-12"></div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100/30 to-[#5A32EA]/10 rounded-full translate-y-10 -translate-x-10"></div>
                          
                          <div className="relative z-10">
                            {/* Quote Icon */}
                            <div className="flex justify-center mb-6">
                              <div className="w-12 h-12 bg-[#5A32EA] rounded-full flex items-center justify-center shadow-lg">
                                <i className="fas fa-quote-left text-white text-lg"></i>
                              </div>
                            </div>
                            
                            {/* Testimonial Quote */}
                            <div className="mb-6 max-h-24 overflow-y-auto scrollbar-hide">
                              <blockquote className="text-sm md:text-base text-gray-700 text-center leading-relaxed italic max-w-3xl mx-auto break-words">
                                "{testimonial.quote}"
                              </blockquote>
                            </div>
                            
                            {/* Alumni Info - Centered */}
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-[#5A32EA]/20 shadow-lg"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                                }}
                              />
                              <div className="space-y-1">
                                <h4 className="text-base md:text-lg font-bold text-gray-900">{testimonial.name}</h4>
                                <p className="text-[#5A32EA] font-semibold text-sm">{testimonial.position}</p>
                                <p className="text-gray-600 text-sm">{testimonial.company}</p>
                                <div className="flex items-center justify-center text-xs text-gray-500 space-x-1">
                                  <i className="fas fa-graduation-cap text-[#5A32EA]"></i>
                                  <span>Class of {testimonial.batch} • {testimonial.department}</span>
                                </div>
                                <div className="flex items-center justify-center text-xs text-gray-500 space-x-1">
                                  <i className="fas fa-map-marker-alt text-[#5A32EA]"></i>
                                  <span>{testimonial.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 p-4 rounded-full hover:bg-[#5A32EA] hover:text-white transition-all duration-300 group border border-gray-200"
              >
                <i className="fas fa-chevron-left group-hover:scale-110 transition-transform duration-300"></i>
              </button>
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 p-4 rounded-full hover:bg-[#5A32EA] hover:text-white transition-all duration-300 group border border-gray-200"
              >
                <i className="fas fa-chevron-right group-hover:scale-110 transition-transform duration-300"></i>
              </button>
              
              {/* Progress Indicators */}
              <div className="flex justify-center mt-12 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`transition-all duration-300 ${
                      index === currentTestimonialIndex 
                        ? 'w-10 h-3 bg-[#5A32EA] rounded-full' 
                        : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* View All Testimonials Button */}
              <div className="text-center mt-12">
                {testimonialsLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading testimonials...</span>
                  </div>
                ) : (
                  <Link
                    to="/testimonials"
                    className="inline-flex items-center px-8 py-4 bg-[#5A32EA] text-white font-semibold rounded-full hover:bg-[#4827b8] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-comments mr-2"></i>
                    <span>View All Testimonials</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Quick Stats from Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#5A32EA] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-thumbs-up text-white text-lg"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">98%</h4>
                <p className="text-gray-600 font-medium text-sm">Alumni Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#5A32EA] to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-user-graduate text-white text-lg"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">87%</h4>
                <p className="text-gray-600 font-medium text-sm">Actively Mentor Current Students</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-[#5A32EA] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <i className="fas fa-heart text-white text-lg"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">94%</h4>
                <p className="text-gray-600 font-medium text-sm">Would Recommend CUCEK</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Alumni Carousel */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <i className="fas fa-medal mr-3 text-[#5A32EA]"></i>
                Alumni Spotlight
              </h2>
              <p className="text-lg text-gray-600">Meet the changemakers from our community</p>
            </div>
            
            <div className="relative">
              {spotlightsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-600 text-sm">Loading spotlights...</p>
                  </div>
                </div>
              ) : successStories.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <i className="fas fa-medal text-5xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No Alumni Spotlights Yet</h3>
                    <p className="text-base text-gray-600 max-w-md mx-auto">
                      We're working on featuring amazing stories from our alumni community. 
                      Check back soon!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-3xl shadow-2xl">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentStoryIndex * 100}%)` }}
                    >
                      {successStories.map((story, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="bg-[#5A32EA] p-1 rounded-3xl">
                        <div className="bg-white rounded-3xl p-6 md:p-8">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                              <img
                                src={story.image}
                                alt={story.name}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-xl border-4 border-white"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';
                                }}
                              />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{story.name}</h3>
                              <div className="text-base font-semibold text-gray-700 mb-1">{story.position}</div>
                              <div className="text-[#5A32EA] font-medium mb-2">{story.company}</div>
                              <div className="flex items-center justify-center md:justify-start text-gray-500 mb-3">
                                <i className="fas fa-graduation-cap mr-2 text-[#5A32EA]"></i>
                                <span className="text-sm">Class of {story.batch} • {story.department}</span>
                              </div>
                              <p className="text-base text-gray-700 mb-3 leading-relaxed">{story.achievement}</p>
                              <div className="inline-flex items-center px-3 py-1 bg-indigo-50 rounded-full text-sm font-medium text-[#5A32EA] border border-indigo-200">
                                <i className="fas fa-chart-line mr-2"></i>
                                {story.impact}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
              
              {/* Carousel Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {successStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStoryIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStoryIndex ? 'bg-[#5A32EA] w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Timeline */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 text-gray-900 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5A32EA]/10 to-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-[#5A32EA]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <i className="fas fa-history mr-3 text-[#5A32EA]"></i>
                Our Legacy
              </h2>
              <p className="text-lg text-gray-600">Three decades of excellence and innovation</p>
            </div>
            
            <div className="relative">
              {/* Enhanced Timeline Line with Gradient */}
              <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-[#5A32EA] via-indigo-400 to-purple-400 rounded-full shadow-sm"></div>

              <div className="space-y-12">
                {timelineMilestones.map((milestone, index) => (
                  <div key={index} className="relative group">
                    <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 hover:border-[#5A32EA]/30 transition-all duration-500 shadow-lg hover:shadow-xl group-hover:scale-105 transform">
                          {/* Gradient Border Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#5A32EA]/5 via-indigo-100/20 to-purple-100/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-[#5A32EA] to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <i className="fas fa-calendar-alt text-white text-sm"></i>
                              </div>
                              <div className="text-2xl font-bold bg-gradient-to-r from-[#5A32EA] to-indigo-600 bg-clip-text text-transparent">
                                {milestone.year}
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5A32EA] transition-colors duration-300">{milestone.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Timeline Dots with Pulse Effect */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                        <div className="relative">
                          <div className="w-6 h-6 bg-gradient-to-r from-[#5A32EA] to-indigo-600 rounded-full border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-125"></div>
                          <div className="absolute inset-0 w-6 h-6 bg-gradient-to-r from-[#5A32EA] to-indigo-600 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action with Modern Design */}
        <section className="py-16 sm:py-20 bg-[#5A32EA] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
                <i className="fas fa-rocket mr-3"></i>
                Ready to Shape the Future?
              </h2>
              <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Join our global community of innovators, entrepreneurs, and leaders who are 
                making a real impact in their fields and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/role-selection')}
                  className="group relative px-10 py-4 bg-white text-[#5A32EA] rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center">
                    <i className="fas fa-user-plus mr-2"></i>
                    Join Alumni Network
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={() => navigate('/events')}
                  className="px-10 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-[#5A32EA] transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-calendar-check mr-2"></i>
                  Explore Events
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-indigo-100">
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