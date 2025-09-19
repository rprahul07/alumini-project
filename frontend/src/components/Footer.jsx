import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-slate-50 to-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-50/30 to-secondary-50/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <div className="pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group" style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-3 shadow-md" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent font-sans">
                    CUCEK Alumni Connect
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-sans text-sm">
                  Empowering CUCEK graduates worldwide through meaningful connections, career opportunities, and lifelong learning.
                </p>
              
                {/* Essential Social Links */}
                <div className="flex space-x-3">
                  <a href="#" className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1" aria-label="LinkedIn" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1" aria-label="Facebook" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-sans">Contact Us</h3>
              <div className="space-y-2.5">
                <a href="mailto:info@cucekalumni.org" className="flex items-center text-slate-600 hover:text-primary-600 transition-colors duration-300 text-sm font-sans">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@cucekalumni.org
                </a>
                <a href="tel:+914841234567" className="flex items-center text-slate-600 hover:text-primary-600 transition-colors duration-300 text-sm font-sans">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 484 123 4567
                </a>
                <div className="flex items-start text-slate-600">
                  <svg className="w-4 h-4 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-sans">Cochin University College of Engineering Kuttanadu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 py-4">
          <div className="text-center">
            <p className="text-slate-500 text-sm font-sans">
              &copy; {new Date().getFullYear()} CUCEK Alumni Connect. All rights reserved.
            </p>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Made with ❤️ for the CUCEK community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
