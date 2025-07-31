import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    alumniCount: 15000,
    activeUsers: 5000,
    successStories: 250
  });
  const [animatedStats, setAnimatedStats] = useState({
    alumniCount: 0,
    activeUsers: 0,
    successStories: 0
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
      });

      if (currentStep === steps) {
        setAnimatedStats(stats);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  // Alumni success stories data
  const successStories = [
    {
      name: 'Arya Rajeev',
      batch: '2019',
      department: 'Computer Science',
      position: 'Senior Software Engineer',
      company: 'Microsoft',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      story: "Leading AI initiatives at Microsoft's cloud division."
    },
    {
      name: 'Vikram Patel',
      batch: '2018',
      department: 'Electronics',
      position: 'CEO & Founder',
      company: 'TechNova Solutions',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      story: "Founded a successful tech startup valued at $50M."
    },
    {
      name: 'Meera Singh',
      batch: '2020',
      department: 'Information Technology',
      position: 'Research Scientist',
      company: 'IBM',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      story: "Pioneering AI research in machine learning."
    }
  ];

  // University timeline milestones
  const timelineMilestones = [
    { year: '1965', title: 'Founded', description: 'CUCEK was established with a vision for excellence.' },
    { year: '1980', title: 'Expansion', description: 'Expanded academic programs and research facilities.' },
    { year: '1995', title: 'Innovation Hub', description: 'Became a leading center for technological innovation.' },
    { year: '2005', title: 'Digital Era', description: 'Launched online learning and digital initiatives.' },
    { year: '2015', title: 'Alumni Network', description: 'Established the alumni connect platform.' },
    { year: '2025', title: 'Global Impact', description: 'Alumni making worldwide impact across industries.' }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-100 to-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent mb-6">
              About CUCEK Alumni Connect
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connecting graduates worldwide to foster professional growth, meaningful relationships, and lifelong learning opportunities.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/role-selection')}
                className="bg-[#5A32EA] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl"
              >
                Join Our Community
              </button>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-[#5A32EA]/10 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-bullseye text-[#5A32EA] text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To create a vibrant, supportive community that connects CUCEK graduates across the globe, 
                  fostering professional development, knowledge sharing, and meaningful relationships that 
                  benefit both individual alumni and the broader university community.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check text-[#5A32EA] mt-1 mr-3"></i>
                    <span className="text-gray-600">Professional networking opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-[#5A32EA] mt-1 mr-3"></i>
                    <span className="text-gray-600">Career development resources</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-[#5A32EA] mt-1 mr-3"></i>
                    <span className="text-gray-600">Mentorship programs</span>
                  </li>
                </ul>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-[#5A32EA]/10 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-eye text-[#5A32EA] text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To be the premier platform that empowers CUCEK alumni to achieve their full potential, 
                  contribute to society's advancement, and maintain lifelong connections with their alma mater 
                  and fellow graduates worldwide.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-star text-[#5A32EA] mt-1 mr-3"></i>
                    <span className="text-gray-600">Global alumni engagement</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-star text-[#5A32EA] mt-1 mr-3"></i>
                    <span className="text-gray-600">Innovation and knowledge exchange</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-star text-[#5A32EA] mt-1 mr-3"></i>
                    <span className="text-gray-600">Sustainable community growth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-lg text-gray-600">Building connections that make a difference</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-t-4 border-[#5A32EA]">
                <div className="text-4xl font-bold text-[#5A32EA] mb-2">
                  {animatedStats.alumniCount.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                  Alumni Members
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-t-4 border-[#5A32EA]">
                <div className="text-4xl font-bold text-[#5A32EA] mb-2">
                  {animatedStats.activeUsers.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                  Active Users
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-t-4 border-[#5A32EA]">
                <div className="text-4xl font-bold text-[#5A32EA] mb-2">
                  {animatedStats.successStories.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                  Success Stories
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Alumni Success Stories</h2>
              <p className="text-lg text-gray-600">Discover how our graduates are making an impact worldwide</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop';
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                    <p className="text-[#5A32EA] font-semibold mb-1">{story.position}</p>
                    <p className="text-gray-600 text-sm mb-2">{story.company}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <i className="fas fa-graduation-cap mr-2"></i>
                      <span>Class of {story.batch} • {story.department}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{story.story}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600">Six decades of excellence and innovation</p>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-[#5A32EA]"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {timelineMilestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left order-2'}`}>
                      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#5A32EA]">
                        <div className="text-2xl font-bold text-[#5A32EA] mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#5A32EA] rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-[#5A32EA] to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Connect with Fellow Alumni?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of CUCEK graduates who are already building meaningful connections and advancing their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/role-selection')}
                className="bg-white text-[#5A32EA] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Join Alumni Network
              </button>
              <button
                onClick={() => navigate('/events')}
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#5A32EA] transition-all"
              >
                Explore Events
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
