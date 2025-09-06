import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { testimonialsAPI } from '../../services/testimonialsService';

const AlumniStories = () => {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default images for fallback
  const defaultImages = {
    alumni1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    alumni2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    alumni3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    alumni4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
  };

  // Color schemes for different stories
  const colorSchemes = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500", 
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500"
  ];

  // Fetch testimonials and transform them into stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await testimonialsAPI.getPublic();
        
        if (result.success && result.data.length > 0) {
          const transformedStories = result.data.slice(0, 4).map((testimonial, index) => ({
            id: testimonial.id,
            name: testimonial.user?.fullName || 'Alumni',
            role: `${testimonial.user?.alumni?.currentJobTitle || 'Professional'} at ${testimonial.user?.alumni?.companyName || 'Company'}`,
            graduationYear: testimonial.user?.alumni?.graduationYear || '2020',
            image: testimonial.user?.photoUrl || defaultImages[`alumni${(index % 4) + 1}`],
            quote: testimonial.content,
            story: `A successful ${testimonial.user?.alumni?.course || 'Engineering'} graduate from ${testimonial.user?.alumni?.graduationYear || '2020'}, now making their mark in the industry.`,
            achievements: [
              `Graduated from ${testimonial.user?.alumni?.course || 'Engineering'}`,
              `Currently working as ${testimonial.user?.alumni?.currentJobTitle || 'Professional'}`,
              `Part of the ${testimonial.user?.department || 'Engineering'} department`
            ],
            color: colorSchemes[index % colorSchemes.length]
          }));
          setStories(transformedStories);
        } else {
          // Fallback to static data if no API data
          setStories([
            {
              id: 1,
              name: "Sarah Johnson",
              role: "Software Engineer at Google",
              graduationYear: "2018",
              image: defaultImages.alumni1,
              quote: "CUCEK gave me the foundation to excel in tech. The hands-on learning and supportive faculty made all the difference.",
              story: "Sarah started as a curious computer science student and graduated as a confident engineer. Her journey from campus coding competitions to leading projects at Google showcases the transformative power of CUCEK education.",
              achievements: ["Led 3 major projects at Google", "Mentored 50+ junior developers", "Founded coding bootcamp for underprivileged youth"],
              color: "from-blue-500 to-cyan-500"
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        // Fallback to static data on error
        setStories([
          {
            id: 1,
            name: "Sarah Johnson",
            role: "Software Engineer at Google",
            graduationYear: "2018",
            image: defaultImages.alumni1,
            quote: "CUCEK gave me the foundation to excel in tech. The hands-on learning and supportive faculty made all the difference.",
            story: "Sarah started as a curious computer science student and graduated as a confident engineer. Her journey from campus coding competitions to leading projects at Google showcases the transformative power of CUCEK education.",
            achievements: ["Led 3 major projects at Google", "Mentored 50+ junior developers", "Founded coding bootcamp for underprivileged youth"],
            color: "from-blue-500 to-cyan-500"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section id="alumni-stories" className="py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-full opacity-50 blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-indigo-800 mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Alumni{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Success Stories
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how our graduates are making an impact across industries worldwide
          </p>
        </motion.div>

        {/* Stories Carousel */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading success stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Success Stories Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your CUCEK success story!</p>
            <button
              onClick={() => navigate('/testimonials')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              <span className="mr-2">Share Your Story</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Buttons */}
            {stories.length > 1 && (
              <>
                <button
                  onClick={prevStory}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextStory}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Story Cards */}
            <div className="relative h-96">
              <AnimatePresence mode="wait">
                {stories.map((story, index) => (
                  activeStory === index && (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: 100, rotateY: 15 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: -100, rotateY: -15 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                          {/* Image Section */}
                          <div className="relative">
                            <img
                              src={story.image}
                              alt={story.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = defaultImages.alumni1;
                              }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${story.color} opacity-20`}></div>
                            
                            {/* Story Number */}
                            <div className={`absolute top-6 left-6 w-12 h-12 bg-gradient-to-r ${story.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                              {index + 1}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-8 flex flex-col justify-center">
                            <div className="mb-6">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{story.name}</h3>
                              <p className="text-lg text-indigo-600 font-semibold mb-1">{story.role}</p>
                              <p className="text-sm text-gray-500">Class of {story.graduationYear}</p>
                            </div>

                            <blockquote className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                              "{story.quote}"
                            </blockquote>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Key Achievements:</h4>
                              <ul className="space-y-2">
                                {story.achievements.map((achievement, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-start"
                                  >
                                    <div className={`w-2 h-2 bg-gradient-to-r ${story.color} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                                    <span className="text-gray-600 text-sm">{achievement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Story Indicators */}
            {stories.length > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStory(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeStory === index
                        ? 'bg-indigo-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AlumniStories;
