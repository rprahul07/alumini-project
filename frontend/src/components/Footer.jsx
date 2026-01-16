import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden font-roboto">
      {/* Enhanced Background decorative elements - Toned down */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <div className="pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">
                    CUCEK Alumni Connect
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-sans text-sm">
                  Empowering CUCEK graduates worldwide through meaningful connections, career opportunities, and lifelong learning.
                </p>

                {/* Essential Social Links */}
                <div className="flex space-x-3 pt-2">
                  <a href="#" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-primary-600 transition-all duration-300" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-primary-600 transition-all duration-300" aria-label="Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-900 font-sans mb-4">Contact Us</h3>
              <div className="space-y-4">
                <a href="mailto:info@cucekalumni.org" className="flex items-center text-slate-600 hover:text-primary-600 transition-colors duration-300 text-sm font-sans group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-primary-50 transition-colors">
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  info@cucekalumni.org
                </a>
                <a href="tel:+914841234567" className="flex items-center text-slate-600 hover:text-primary-600 transition-colors duration-300 text-sm font-sans group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-primary-50 transition-colors">
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  +91 484 123 4567
                </a>
                <div className="flex items-start text-slate-600 group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-sans py-1.5">Cochin University College of Engineering Kuttanadu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 py-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm font-sans">
              &copy; {new Date().getFullYear()} CUCEK Alumni Connect. All rights reserved.
            </p>
            <p className="text-slate-400 text-xs mt-2 font-sans flex items-center justify-center">
              Made with <span className="text-red-400 mx-1">❤️</span> for the CUCEK community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
