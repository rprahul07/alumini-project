import React from 'react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div 
        className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl max-w-4xl m-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Login to reconnect with your community.</p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                required 
              />
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            <button 
              type="submit" 
              className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-8">
            Don't have an account? <a href="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</a>
          </p>
        </div>
        
        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" 
            alt="Alumni connecting" 
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;