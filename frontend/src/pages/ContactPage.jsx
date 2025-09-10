import React, { useState } from 'react';
import axios from '../config/axios';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useInteractionTracking, useAnalytics } from '../hooks/useAnalytics';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Analytics tracking
  const { trackClick, trackSubmit, trackFocus } = useInteractionTracking('contact');
  const { trackEngagement, trackConversion } = useAnalytics();

  // FAQ data
  const faqs = [
    {
      question: "How do I create an alumni account?",
      answer: "Click on 'Sign Up' and select 'Alumni' as your role. Fill in your graduation details and current professional information to complete your profile."
    },
    {
      question: "How can I post job opportunities?",
      answer: "Alumni can post jobs by navigating to the Jobs section and clicking 'Post Job'. All job postings require admin approval before going live."
    },
    {
      question: "How do I connect with other alumni?",
      answer: "Use the Alumni directory to search for classmates by graduation year, department, or company. You can send mentorship requests or connection invitations."
    },
    {
      question: "Can students apply for jobs posted by alumni?",
      answer: "Yes! Students can browse and apply for jobs posted by alumni. The application process varies depending on whether it's internal or external registration."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your profile settings to update your professional details, contact information, and profile picture. Keep your information current to enhance networking opportunities."
    },
    {
      question: "What events are available through the platform?",
      answer: "The platform hosts various events including networking sessions, career workshops, alumni meetups, and industry talks. Check the Events section regularly for updates."
    }
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name must only contain letters and spaces';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters long';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    return newErrors;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Track form submission attempt
    trackSubmit(e.target, 'contact_form');
    
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Track contact form submission
      trackConversion('contact_form_submission', {
        subject: formData.subject,
        email_domain: formData.email.split('@')[1]
      });
      
      const response = await axios.post('/api/contactus', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (response.data.success) {
        // Track successful contact form submission
        trackConversion('contact_form_success', {
          subject: formData.subject,
          email_domain: formData.email.split('@')[1]
        });
        
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to send message. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    trackClick(null, `faq_${index}_toggle`);
    trackEngagement('faq_interaction', {
      faq_index: index,
      faq_question: faqs[index]?.question,
      action: expandedFaq === index ? 'close' : 'open'
    });
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
      {isSubmitted ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-white/20"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i className="fas fa-check text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Message Sent Successfully!</h1>
            <p className="text-lg text-gray-300 mb-8">
              Thank you for contacting us. We've received your message and will get back to you within 24-48 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      ) : (
        <>
        {/* Hero Section */}
        <section id="support" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>💬 Contact Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Get in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  Touch
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-body">
                Have questions about CUCEK Alumni Connect? Need help with your account? We're here to support our alumni community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all text-white placeholder-gray-300 ${errors.name ? 'border-red-500' : 'border-white/30'
                          }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all text-white placeholder-gray-300 ${errors.email ? 'border-red-500' : 'border-white/30'
                          }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-white/90 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all text-white placeholder-gray-300 ${errors.subject ? 'border-red-500' : 'border-white/30'
                          }`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all resize-none text-white placeholder-gray-300 ${errors.message ? 'border-red-500' : 'border-white/30'
                          }`}
                        placeholder="How can we help you? Please provide as much detail as possible..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Sending Message...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <i className="fas fa-paper-plane mr-2"></i>
                            Send Message
                          </span>
                        )}
                      </button>
                    </div>

                    {errors.submit && (
                      <div className="text-center">
                        <p className="text-sm text-red-400">{errors.submit}</p>
                      </div>
                    )}
                  </form>
                </motion.div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Contact Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>

                  <div className="space-y-6">
                    {/* Email Support */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-envelope text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Email Support</h4>
                        <p className="text-gray-300">alumni@cucek.ac.in</p>
                        <span className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs px-3 py-1 rounded-full mt-2 border border-green-500/30">
                          24/7 Support
                        </span>
                      </div>
                    </div>

                    {/* Phone Support */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-phone text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Phone Support</h4>
                        <p className="text-gray-300">+91 484 286 2173</p>
                        <span className="inline-block bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs px-3 py-1 rounded-full mt-2 border border-blue-500/30">
                          Mon-Fri 9AM-6PM
                        </span>
                      </div>
                    </div>

                    {/* Office Location */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-map-marker-alt text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Campus Address</h4>
                        <p className="text-gray-300">
                          Cochin University of Science and Technology<br />
                          Pulincunnu, Kerala 688504, India
                        </p>
                        <span className="inline-block bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs px-3 py-1 rounded-full mt-2 border border-orange-500/30">
                          Visitors Welcome
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Response Time Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white border border-white/30 relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-2xl animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-clock text-2xl mr-3"></i>
                      <h3 className="text-xl font-bold">Response Time</h3>
                    </div>
                    <p className="text-white/80 mb-4">
                      We typically respond to all inquiries within 24-48 hours during business days.
                    </p>
                    <div className="flex items-center text-sm text-white/70">
                      <i className="fas fa-info-circle mr-2"></i>
                      For urgent matters, please call our phone support line
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>❓ FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400">
                  Questions
                </span>
              </h2>
              <p className="text-lg text-gray-300">
                Find quick answers to common questions about CUCEK Alumni Connect
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl hover:border-white/30 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-white">{faq.question}</span>
                    <i className={`fas fa-chevron-down transition-transform text-primary-400 ${expandedFaq === index ? 'rotate-180' : ''
                      }`}></i>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4 border-t border-white/10"
                      >
                        <p className="text-gray-300 leading-relaxed pt-4">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        </>
      )}
      </div>
    </>
  );
};

export default ContactPage;