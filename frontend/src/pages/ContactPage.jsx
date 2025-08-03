import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    contactType: 'general'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Name must only contain letters and spaces';
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
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for contacting us. We've received your message and will get back to you within 24-48 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-[#5A32EA] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section id="support" className="bg-gradient-to-r from-indigo-100 to-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about CUCEK Alumni Connect? Need help with your account? We're here to support our alumni community.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'general', label: 'General Inquiry', icon: 'fas fa-question-circle' },
                          { value: 'technical', label: 'Technical Support', icon: 'fas fa-cog' },
                          { value: 'account', label: 'Account Issues', icon: 'fas fa-user' },
                          { value: 'feedback', label: 'Feedback', icon: 'fas fa-comment' }
                        ].map((type) => (
                          <label key={type.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="contactType"
                              value={type.value}
                              checked={formData.contactType === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`p-3 border-2 rounded-xl text-center transition-all ${formData.contactType === type.value
                                ? 'border-[#5A32EA] bg-[#5A32EA]/5 text-[#5A32EA]'
                                : 'border-gray-200 hover:border-gray-300'
                              }`}>
                              <i className={`${type.icon} text-lg mb-1`}></i>
                              <p className="text-sm font-medium">{type.label}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5A32EA] focus:border-transparent transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5A32EA] focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5A32EA] focus:border-transparent transition-all ${errors.subject ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#5A32EA] focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="How can we help you? Please provide as much detail as possible..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#5A32EA] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#4827b8] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Contact Cards */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

                  <div className="space-y-6">
                    {/* Email Support */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#5A32EA]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-envelope text-[#5A32EA] text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email Support</h4>
                        <p className="text-gray-600">alumni@cucek.ac.in</p>
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mt-2">
                          24/7 Support
                        </span>
                      </div>
                    </div>

                    {/* Phone Support */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#5A32EA]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-phone text-[#5A32EA] text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone Support</h4>
                        <p className="text-gray-600">+91 484 286 2173</p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-2">
                          Mon-Fri 9AM-6PM
                        </span>
                      </div>
                    </div>

                    {/* Office Location */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#5A32EA]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-map-marker-alt text-[#5A32EA] text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Campus Address</h4>
                        <p className="text-gray-600">
                          Cochin University of Science and Technology<br />
                          Pulincunnu, Kerala 682022, India
                        </p>
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full mt-2">
                          Visitors Welcome
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time Card */}
                <div className="bg-gradient-to-r from-[#5A32EA] to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-clock text-2xl mr-3"></i>
                    <h3 className="text-xl font-bold">Response Time</h3>
                  </div>
                  <p className="text-indigo-100 mb-4">
                    We typically respond to all inquiries within 24-48 hours during business days.
                  </p>
                  <div className="flex items-center text-sm text-indigo-200">
                    <i className="fas fa-info-circle mr-2"></i>
                    For urgent matters, please call our phone support line
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Find quick answers to common questions about CUCEK Alumni Connect
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <i className={`fas fa-chevron-down transition-transform ${expandedFaq === index ? 'rotate-180' : ''
                      }`}></i>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;