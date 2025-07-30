import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mission');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [stats, setStats] = useState({
    alumniCount: 15000,
    activeUsers: 5000,
    successStories: 250,
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

  // Auto-rotate success stories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Alumni success stories data with more dynamic content
  const successStories = [
    {
      name: 'Dr. Sarah Chen',
      batch: '2015',
      department: 'Computer Science',
      position: 'AI Research Director',
      company: 'Google DeepMind',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      achievement: 'Led breakthrough research in quantum computing algorithms',
      impact: '50+ research papers, 3 patents',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Arjun Mehta',
      batch: '2012',
      department: 'Mechanical Engineering',
      position: 'Founder & CEO',
      company: 'GreenTech Innovations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      achievement: 'Built sustainable energy solutions for 200+ cities',
      impact: '$2B+ in clean energy investments',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Priya Sharma',
      batch: '2018',
      department: 'Biomedical Engineering',
      position: 'Chief Medical Officer',
      company: 'MedTech Solutions',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      achievement: 'Developed life-saving medical devices for rural healthcare',
      impact: '1M+ lives impacted globally',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Ravi Kumar',
      batch: '2010',
      department: 'Electronics',
      position: 'Space Systems Engineer',
      company: 'ISRO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      achievement: 'Key contributor to Mars Orbiter Mission success',
      impact: 'Advanced India\'s space exploration capabilities',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Company logos for credibility
  const partnerCompanies = [
    { name: 'Google', logo: 'fab fa-google', color: 'text-red-500' },
    { name: 'Microsoft', logo: 'fab fa-microsoft', color: 'text-blue-600' },
    { name: 'Apple', logo: 'fab fa-apple', color: 'text-gray-800' },
    { name: 'Amazon', logo: 'fab fa-amazon', color: 'text-orange-500' },
    { name: 'Meta', logo: 'fab fa-meta', color: 'text-blue-700' },
    { name: 'IBM', logo: 'fas fa-cube', color: 'text-blue-800' }
  ];

  // Gallery images for campus life and events
  const galleryImages = [
    {
      id: 1,
      title: 'Modern Campus Life',
      description: 'State-of-the-art facilities and vibrant student community',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      category: 'Campus'
    },
    {
      id: 2,
      title: 'Research Excellence',
      description: 'Cutting-edge laboratories and research facilities',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
      category: 'Research'
    },
    {
      id: 3,
      title: 'Alumni Networking Events',
      description: 'Global alumni meetups and professional networking',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      category: 'Events'
    },
    {
      id: 4,
      title: 'Innovation Labs',
      description: 'Students working on breakthrough technologies',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      category: 'Innovation'
    },
    {
      id: 5,
      title: 'Graduation Ceremonies',
      description: 'Celebrating achievements and new beginnings',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      category: 'Celebrations'
    },
    {
      id: 6,
      title: 'Technical Competitions',
      description: 'Students showcasing their engineering prowess',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop',
      category: 'Competitions'
    },
    {
      id: 7,
      title: 'Industry Partnerships',
      description: 'Collaborations with leading tech companies',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      category: 'Industry'
    },
    {
      id: 8,
      title: 'Cultural Events',
      description: 'Celebrating diversity and creativity',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      category: 'Culture'
    }
  ];

  // Alumni testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Anjali Krishnan',
      batch: '2016',
      department: 'Computer Science',
      position: 'Senior Product Manager',
      company: 'Amazon',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      quote: "CUCEK didn't just give me an education; it gave me a mindset to solve problems that matter. The alumni network has been instrumental in my career growth, connecting me with mentors and opportunities I never imagined possible.",
      rating: 5,
      location: 'Seattle, USA'
    },
    {
      id: 2,
      name: 'Rahul Menon',
      batch: '2014',
      department: 'Mechanical Engineering',
      position: 'Founder & CTO',
      company: 'CleanEnergy Solutions',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      quote: "The entrepreneurial spirit at CUCEK is infectious. My professors encouraged me to think beyond textbooks, and the alumni community provided the support system I needed to start my own company. Today, we're powering sustainable energy solutions across 15 countries.",
      rating: 5,
      location: 'Bangalore, India'
    },
    {
      id: 3,
      name: 'Dr. Kavya Nair',
      batch: '2013',
      department: 'Biomedical Engineering',
      position: 'Lead Research Scientist',
      company: 'Johnson & Johnson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      quote: "CUCEK's emphasis on research excellence prepared me for a career in medical innovation. The collaborative environment and world-class faculty helped me develop critical thinking skills that I use every day in developing life-saving medical devices.",
      rating: 5,
      location: 'New Jersey, USA'
    },
    {
      id: 4,
      name: 'Arun Kumar',
      batch: '2011',
      department: 'Electronics Engineering',
      position: 'Vice President Engineering',
      company: 'Tesla',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      quote: "The rigorous curriculum and hands-on projects at CUCEK built my foundation in engineering excellence. The alumni network spans every major tech company globally, and we actively support each other's growth. It's more than a network; it's a family.",
      rating: 5,
      location: 'California, USA'
    },
    {
      id: 5,
      name: 'Preethi Sharma',
      batch: '2017',
      department: 'Information Technology',
      position: 'AI Ethics Researcher',
      company: 'MIT',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      quote: "CUCEK taught me to question the status quo and think ethically about technology's impact on society. The diverse perspectives of my classmates and the progressive thinking of faculty members shaped my approach to responsible AI development.",
      rating: 5,
      location: 'Boston, USA'
    },
    {
      id: 6,
      name: 'Vikash Patel',
      batch: '2015',
      department: 'Civil Engineering',
      position: 'Sustainable Architecture Lead',
      company: 'Foster + Partners',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      quote: "The multidisciplinary approach at CUCEK opened my eyes to the intersection of engineering and environmental consciousness. Today, I design buildings that not only stand strong but also contribute to a sustainable future. The alumni community continues to inspire and support my work.",
      rating: 5,
      location: 'London, UK'
    }
  ];

  // University achievements and milestones
  const achievements = [
    {
      icon: 'fas fa-trophy',
      title: 'Top Engineering College',
      description: 'Ranked #1 in Kerala for innovation and research',
      color: 'text-yellow-500'
    },
    {
      icon: 'fas fa-globe',
      title: 'Global Recognition',
      description: 'Alumni working in 85+ countries worldwide',
      color: 'text-blue-500'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Innovation Hub',
      description: '200+ startups founded by our graduates',
      color: 'text-purple-500'
    },
    {
      icon: 'fas fa-users',
      title: 'Strong Network',
      description: '98% employment rate within 6 months',
      color: 'text-green-500'
    }
  ];

  // University timeline milestones
  const timelineMilestones = [
    { year: '1999', title: 'Founded', description: 'CUCEK was established with a vision for excellence.' },
    { year: '2005', title: 'Expansion', description: 'Expanded academic programs and research facilities.' },
    { year: '2008', title: 'Innovation Hub', description: 'Became a leading center for technological innovation.' },
    { year: '2015', title: 'Digital Era', description: 'Launched online learning and digital initiatives.' },
    { year: '2018', title: 'Alumni Network', description: 'Established the alumni connect platform.' },
    { year: '2025', title: 'Global Impact', description: 'Alumni making worldwide impact across industries.' }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Dynamic Hero Section with Floating Elements */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-6">
                <i className="fas fa-graduation-cap mr-2"></i>
                Est. 1999 • Excellence in Engineering
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Where 
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"> Innovation </span>
              Meets Legacy
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Join a network of 15,000+ brilliant minds who are shaping the future across technology, 
              research, entrepreneurship, and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/role-selection')}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Join Our Community</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-2xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300"
              >
                Explore Events
              </button>
            </div>

            {/* Floating Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {animatedStats.alumniCount.toLocaleString()}+
                </div>
                <div className="text-gray-300 text-sm">Alumni</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {animatedStats.countries}+
                </div>
                <div className="text-gray-300 text-sm">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {animatedStats.successStories}+
                </div>
                <div className="text-gray-300 text-sm">Success Stories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {animatedStats.activeUsers.toLocaleString()}+
                </div>
                <div className="text-gray-300 text-sm">Active Users</div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Company Partners Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600 mb-8">Our alumni work at leading organizations worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="flex items-center space-x-3 text-2xl hover:opacity-100 transition-opacity duration-300">
                  <i className={`${company.logo} ${company.color} text-3xl`}></i>
                  <span className="font-semibold text-gray-700">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Mission/Vision/Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-bullseye text-white text-2xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To create a vibrant ecosystem where CUCEK graduates connect, collaborate, and contribute 
                    to technological advancement and societal progress while maintaining lifelong bonds with 
                    their alma mater.
                  </p>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-eye text-white text-2xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To be the world's premier engineering alumni network, fostering innovation, 
                    entrepreneurship, and leadership that addresses global challenges and creates 
                    a sustainable future for humanity.
                  </p>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-heart text-white text-2xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-lightbulb text-yellow-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Innovation</h4>
                      <p className="text-sm text-gray-600">Pushing boundaries and creating solutions</p>
                    </div>
                    <div className="p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-handshake text-blue-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900">Collaboration</h4>
                      <p className="text-sm text-gray-600">Building bridges across disciplines</p>
                    </div>
                    <div className="p-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-star text-purple-600"></i>
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
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CUCEK?</h2>
              <p className="text-xl text-gray-600">Discover what makes our community exceptional</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="group h-full">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${achievement.color === 'text-yellow-500' ? 'from-yellow-400 to-orange-400' : achievement.color === 'text-blue-500' ? 'from-blue-400 to-cyan-400' : achievement.color === 'text-purple-500' ? 'from-purple-400 to-pink-400' : 'from-green-400 to-teal-400'}`}>
                      <i className={`${achievement.icon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Gallery Section */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus Life Gallery</h2>
              <p className="text-xl text-gray-600">Experience the vibrant life at CUCEK through our visual journey</p>
            </div>
            
            <div className="relative">
              {/* Main Gallery Display */}
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={image.id} className="w-full flex-shrink-0 relative">
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4">
                          {image.category}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{image.title}</h3>
                        <p className="text-lg text-gray-200">{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
                >
                  <i className="fas fa-chevron-left group-hover:scale-110 transition-transform duration-300"></i>
                </button>
                <button
                  onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
                >
                  <i className="fas fa-chevron-right group-hover:scale-110 transition-transform duration-300"></i>
                </button>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="flex justify-center mt-8 space-x-2 overflow-x-auto pb-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentGalleryIndex 
                        ? 'ring-4 ring-purple-500 ring-opacity-60 scale-110' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
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
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {[...new Set(galleryImages.map(img => img.category))].map((category, index) => (
                  <button
                    key={category}
                    onClick={() => {
                      const categoryIndex = galleryImages.findIndex(img => img.category === category);
                      setCurrentGalleryIndex(categoryIndex);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium hover:from-purple-200 hover:to-pink-200 transition-all duration-300 hover:scale-105"
                  >
                    {category}
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
                        ? 'w-8 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' 
                        : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Alumni Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Alumni Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from graduates who are making their mark across the globe
              </p>
            </div>
            
            <div className="relative">
              {/* Main Testimonial Display */}
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                      <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                          {/* Decorative Elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-100 to-orange-100 rounded-full translate-y-12 -translate-x-12"></div>
                          
                          <div className="relative z-10">
                            {/* Quote Icon */}
                            <div className="flex justify-center mb-8">
                              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <i className="fas fa-quote-left text-white text-2xl"></i>
                              </div>
                            </div>
                            
                            {/* Testimonial Quote */}
                            <blockquote className="text-lg md:text-xl text-gray-700 text-center leading-relaxed mb-8 italic">
                              "{testimonial.quote}"
                            </blockquote>
                            
                            {/* Rating Stars */}
                            <div className="flex justify-center mb-6">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <i key={i} className="fas fa-star text-yellow-400 text-xl mx-1"></i>
                              ))}
                            </div>
                            
                            {/* Alumni Info */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                                }}
                              />
                              <div className="text-center md:text-left">
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{testimonial.name}</h4>
                                <p className="text-purple-600 font-semibold mb-1">{testimonial.position}</p>
                                <p className="text-gray-600 mb-1">{testimonial.company}</p>
                                <div className="flex items-center justify-center md:justify-start text-sm text-gray-500">
                                  <i className="fas fa-graduation-cap mr-2"></i>
                                  <span>Class of {testimonial.batch} • {testimonial.department}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mt-1">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 p-4 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 group"
              >
                <i className="fas fa-chevron-left group-hover:scale-110 transition-transform duration-300"></i>
              </button>
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg text-gray-700 p-4 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 group"
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
                        ? 'w-10 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' 
                        : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Quick Stats from Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-thumbs-up text-white text-2xl"></i>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">98%</h4>
                <p className="text-gray-600 font-medium">Alumni Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-handshake text-white text-2xl"></i>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">87%</h4>
                <p className="text-gray-600 font-medium">Actively Mentor Current Students</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-white text-2xl"></i>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">94%</h4>
                <p className="text-gray-600 font-medium">Would Recommend CUCEK</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Alumni Carousel */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Alumni Spotlight</h2>
              <p className="text-xl text-gray-600">Meet the changemakers from our community</p>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentStoryIndex * 100}%)` }}
                >
                  {successStories.map((story, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className={`bg-gradient-to-r ${story.color} p-1 rounded-3xl`}>
                        <div className="bg-white rounded-3xl p-8 md:p-12">
                          <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                              <img
                                src={story.image}
                                alt={story.name}
                                className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';
                                }}
                              />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h3 className="text-3xl font-bold text-gray-900 mb-2">{story.name}</h3>
                              <div className="text-lg font-semibold text-gray-700 mb-1">{story.position}</div>
                              <div className="text-purple-600 font-medium mb-2">{story.company}</div>
                              <div className="flex items-center justify-center md:justify-start text-gray-500 mb-4">
                                <i className="fas fa-graduation-cap mr-2"></i>
                                <span>Class of {story.batch} • {story.department}</span>
                              </div>
                              <p className="text-lg text-gray-700 mb-4 leading-relaxed">{story.achievement}</p>
                              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
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
                      index === currentStoryIndex ? 'bg-purple-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Timeline */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Legacy</h2>
              <p className="text-xl text-purple-200">Six decades of excellence and innovation</p>
            </div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-purple-400 to-pink-400"></div>
              
              <div className="space-y-16">
                {timelineMilestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <div className="text-2xl font-bold text-purple-300 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                          <p className="text-purple-100">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-4 border-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action with Modern Design */}
        <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Shape the Future?
              </h2>
              <p className="text-xl text-purple-100 mb-10 leading-relaxed">
                Join our global community of innovators, entrepreneurs, and leaders who are 
                making a real impact in their fields and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => navigate('/role-selection')}
                  className="group relative px-10 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10">Join Alumni Network</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={() => navigate('/events')}
                  className="px-10 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  Explore Events
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-purple-100">
                <div className="flex flex-col items-center">
                  <i className="fas fa-network-wired text-3xl mb-3"></i>
                  <h4 className="font-semibold">Global Network</h4>
                  <p className="text-sm">Connect worldwide</p>
                </div>
                <div className="flex flex-col items-center">
                  <i className="fas fa-rocket text-3xl mb-3"></i>
                  <h4 className="font-semibold">Innovation Hub</h4>
                  <p className="text-sm">Drive technology forward</p>
                </div>
                <div className="flex flex-col items-center">
                  <i className="fas fa-users text-3xl mb-3"></i>
                  <h4 className="font-semibold">Lifelong Community</h4>
                  <p className="text-sm">Support and growth</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default AboutPage;
