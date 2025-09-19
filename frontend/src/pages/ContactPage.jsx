import React, { useState } from 'react';
import axios from '../config/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden pt-16">
      {isSubmitted ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-center border border-slate-200"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-check text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold font-sans text-slate-900 mb-3">Message Sent Successfully!</h1>
            <p className="text-sm font-sans text-slate-600 mb-6">
              Thank you for contacting us. We've received your message and will get back to you within 24-48 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-semibold font-sans hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      ) : (
        <>
        {/* Hero Section */}
        <section id="support" className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
          {/* Enhanced Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-100/30 to-secondary-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold font-sans bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg">
                <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                <span>💬 Contact Us</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-slate-900 mb-4 leading-tight">
                Get in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse">
                  Touch
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
                Have questions about CUCEK Alumni Connect? Need help with your account? We're here to support our alumni community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-200"
                >
                  <h2 className="text-xl font-bold font-sans text-slate-900 mb-4">Send us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium font-sans text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white/80 backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm font-sans text-slate-900 placeholder-slate-500 ${errors.name ? 'border-red-500' : 'border-slate-300'
                          }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs font-sans text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium font-sans text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white/80 backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm font-sans text-slate-900 placeholder-slate-500 ${errors.email ? 'border-red-500' : 'border-slate-300'
                          }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-sans text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-xs font-medium font-sans text-slate-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white/80 backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm font-sans text-slate-900 placeholder-slate-500 ${errors.subject ? 'border-red-500' : 'border-slate-300'
                          }`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs font-sans text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-medium font-sans text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white/80 backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all resize-none text-sm font-sans text-slate-900 placeholder-slate-500 ${errors.message ? 'border-red-500' : 'border-slate-300'
                          }`}
                        placeholder="How can we help you? Please provide as much detail as possible..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs font-sans text-red-600">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg font-semibold font-sans hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
                        <p className="text-sm text-red-600">{errors.submit}</p>
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
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-200"
                >
                  <h3 className="text-lg font-bold font-sans text-slate-900 mb-4">Contact Information</h3>

                  <div className="space-y-4">
                    {/* Email Support */}
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-envelope text-white text-sm"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold font-sans text-sm text-slate-900">Email Support</h4>
                        <p className="text-xs font-sans text-slate-600">alumni@cucek.ac.in</p>
                        <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs px-2 py-1 rounded-full mt-1 border border-green-200">
                          24/7 Support
                        </span>
                      </div>
                    </div>

                    {/* Phone Support */}
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-phone text-white text-sm"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold font-sans text-sm text-slate-900">Phone Support</h4>
                        <p className="text-xs font-sans text-slate-600">+91 484 286 2173</p>
                        <span className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-1 border border-blue-200">
                          Mon-Fri 9AM-6PM
                        </span>
                      </div>
                    </div>

                    {/* Office Location */}
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-map-marker-alt text-white text-sm"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold font-sans text-sm text-slate-900">Campus Address</h4>
                        <p className="text-xs font-sans text-slate-600">
                          Cochin University of Science and Technology<br />
                          Pulincunnu, Kerala 688504, India
                        </p>
                        <span className="inline-block bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs px-2 py-1 rounded-full mt-1 border border-orange-200">
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
                  className="bg-gradient-to-r from-primary-100 to-secondary-100 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-slate-900 border border-slate-200 relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/40 to-secondary-100/40 rounded-2xl animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-3">
                      <i className="fas fa-clock text-lg mr-2"></i>
                      <h3 className="text-lg font-bold font-sans text-slate-900">Response Time</h3>
                    </div>
                    <p className="text-sm font-sans text-slate-600 mb-3">
                      We typically respond to all inquiries within 24-48 hours during business days.
                    </p>
                    <div className="flex items-center text-xs font-sans text-slate-500">
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
        <section id="faq" className="py-12 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold font-sans bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg">
                <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                <span>❓ FAQ</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-sans text-slate-900 mb-3">
                Frequently Asked{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                  Questions
                </span>
              </h2>
              <p className="text-sm md:text-base font-sans text-slate-600">
                Find quick answers to common questions about CUCEK Alumni Connect
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl overflow-hidden shadow-2xl hover:border-slate-300 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold font-sans text-sm text-slate-900">{faq.question}</span>
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
                        className="px-6 pb-4 border-t border-slate-200"
                      >
                        <p className="text-sm font-sans text-slate-600 leading-relaxed pt-3">{faq.answer}</p>
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
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default ContactPage;