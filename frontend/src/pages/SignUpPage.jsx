import React from 'react';
import { motion } from 'framer-motion';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <motion.div 
        className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl max-w-4xl m-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800" 
            alt="Students collaborating" 
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Create Your Account</h1>
          <p className="text-gray-600 mb-8">Join the community and start connecting.</p>
          
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                required 
              />
              <input 
                type="text" 
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                required 
              />
            </div>
             <div>
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                required 
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Create a Password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                required 
              />
            </div>

            {/* User Type Selection */}
            <div className="pt-2">
                <label className="block text-gray-700 font-semibold mb-3">I am a:</label>
                <div className="flex gap-4">
                    <label className="flex items-center p-3 border border-gray-300 rounded-md flex-grow cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600">
                        <input type="radio" name="userType" value="student" className="mr-2 accent-blue-600"/>
                        Student
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-md flex-grow cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600">
                        <input type="radio" name="userType" value="alumni" className="mr-2 accent-blue-600"/>
                        Alumni
                    </label>
                </div>
            </div>

            <button 
              type="submit" 
              className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-8">
            Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Log In</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;