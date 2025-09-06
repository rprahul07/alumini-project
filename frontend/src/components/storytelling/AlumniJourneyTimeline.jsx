import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { testimonialsAPI } from '../../services/testimonialsService';

const AlumniJourneyTimeline = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState(0);

  // Career journey stages
  const careerStages = [
    {
      id: 1,
      stage: 'Student',
      icon: '🎓',
      description: 'Learning and growing at CUCEK',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      stage: 'Graduate',
      icon: '🎯',
      description: 'First steps into the professional world',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      stage: 'Professional',
      icon: '💼',
      description: 'Building career and expertise',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      stage: 'Leader',
      icon: '⭐',
      description: 'Mentoring and inspiring others',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // Sample alumni success stories (in real app, this would come from API)
  const successStories = [
    {
      id: 1,
      name: 'Sarah Johnson',
      graduationYear: 2018,
      currentRole: 'Senior Software Engineer',
      company: 'Google',
      journey: [
        { year: 2018, role: 'Graduate', company: 'CUCEK', description: 'Completed Computer Science' },
        { year: 2019, role: 'Junior Developer', company: 'TechStart', description: 'First job in software development' },
        { year: 2021, role: 'Software Engineer', company: 'Microsoft', description: 'Joined major tech company' },
        { year: 2023, role: 'Senior Engineer', company: 'Google', description: 'Leading technical projects' }
      ],
      testimonial: 'CUCEK gave me the foundation to dream big. The professors and friends I made there are still part of my journey.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      graduationYear: 2019,
      currentRole: 'Data Scientist',
      company: 'Amazon',
      journey: [
        { year: 2019, role: 'Graduate', company: 'CUCEK', description: 'Completed Data Science' },
        { year: 2020, role: 'Data Analyst', company: 'AnalyticsCorp', description: 'Started in data analytics' },
        { year: 2022, role: 'Data Scientist', company: 'Amazon', description: 'Working on ML projects' }
      ],
      testimonial: 'The analytical thinking I developed at CUCEK helps me solve complex problems every day.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      graduationYear: 2020,
      currentRole: 'Product Manager',
      company: 'Apple',
      journey: [
        { year: 2020, role: 'Graduate', company: 'CUCEK', description: 'Completed Engineering' },
        { year: 2021, role: 'Associate PM', company: 'StartupXYZ', description: 'First product role' },
        { year: 2023, role: 'Product Manager', company: 'Apple', description: 'Leading product strategy' }
      ],
      testimonial: 'CUCEK taught me to think beyond code - to understand users and build meaningful solutions.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop'
    }
  ];

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await testimonialsAPI.getPublic();
        if (result.success && result.data.length > 0) {
          const transformedTestimonials = result.data.slice(0, 3).map(testimonial => ({
            id: testimonial.id,
            name: testimonial.user?.fullName || 'Alumni',
            content: testimonial.content,
            image: testimonial.user?.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop'
          }));
          setTestimonials(transformedTestimonials);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleTimelineChange = (index) => {
    setActiveTimeline(index);
  };

  const handleExploreStories = () => {
    navigate('/testimonials');
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-800 mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Alumni{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Success Journey
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover inspiring career paths and success stories from our alumni network
          </p>
        </motion.div>

        {/* Career Stages Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
            
            {/* Timeline Stages */}
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              {careerStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  {/* Stage Icon */}
                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 mx-auto bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-center text-white text-2xl shadow-lg mb-4`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {stage.icon}
                    </motion.div>
                  </div>
                  
                  {/* Stage Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{stage.stage}</h3>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                  
                  {/* Connection Line */}
                  {index < careerStages.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 transform -translate-y-1/2"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Success Stories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => handleStoryClick(story)}
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Story Header */}
                  <div className="flex items-center mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {story.name}
                      </h3>
                      <p className="text-sm text-gray-600">{story.currentRole}</p>
                      <p className="text-sm text-blue-600 font-medium">{story.company}</p>
                    </div>
                  </div>

                  {/* Journey Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Career Journey:</div>
                    <div className="space-y-1">
                      {story.journey.slice(-2).map((step, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          <span className="text-gray-700">{step.year}: {step.role} at {step.company}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 italic line-clamp-3">
                      "{story.testimonial}"
                    </p>
                  </div>

                  {/* Click Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">Click to explore full journey</span>
                    <motion.svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={handleExploreStories}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">Explore All Success Stories</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Story Header */}
              <div className="flex items-center mb-6">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.name}
                  className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-blue-100"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStory.name}</h2>
                  <p className="text-lg text-gray-600 mb-1">{selectedStory.currentRole}</p>
                  <p className="text-blue-600 font-semibold">{selectedStory.company}</p>
                  <p className="text-sm text-gray-500">Class of {selectedStory.graduationYear}</p>
                </div>
              </div>

              {/* Full Journey Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Journey</h3>
                <div className="space-y-4">
                  {selectedStory.journey.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {step.year}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{step.role}</h4>
                        <p className="text-blue-600 font-medium">{step.company}</p>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Full Testimonial */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Message</h3>
                <blockquote className="text-gray-700 italic bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  "{selectedStory.testimonial}"
                </blockquote>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AlumniJourneyTimeline;
