import React from 'react';
import { motion } from 'framer-motion';

const ContactUsPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-gray-800"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We'd love to hear from you. Get in touch with the alumni relations office.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input type="text" id="name" name="name" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input type="email" id="email" name="email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" required />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea id="message" name="message" rows="5" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" required></textarea>
              </div>
              <button type="submit" className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">123 College Avenue,<br/>University Town, USA 12345</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p className="text-gray-600 hover:text-blue-600"><a href="mailto:alumni@college.edu">alumni@college.edu</a></p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                <p className="text-gray-600">(123) 456-7890</p>
              </div>
            </div>
            {/* You can embed a map here if you like */}
            <div className="mt-8 bg-gray-200 h-48 rounded-md flex items-center justify-center text-gray-500">
              Map Placeholder
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ContactUsPage;