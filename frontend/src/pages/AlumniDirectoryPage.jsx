import React from 'react';
import AlumniDirectoryCard from '../components/AlumniDirectoryCard';
import { motion } from 'framer-motion';

// Placeholder data - later this will come from an API
const alumniData = [
  { name: 'Jane Doe', year: 2015, major: 'Computer Science', role: 'Software Engineer', company: 'Google', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800' },
  { name: 'John Smith', year: 2012, major: 'Business Admin', role: 'Product Manager', company: 'Microsoft', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800' },
  { name: 'Emily White', year: 2018, major: 'Graphic Design', role: 'UX Designer', company: 'Apple', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800' },
  { name: 'Michael Brown', year: 2010, major: 'Marketing', role: 'Founder & CEO', company: 'Innovate Inc.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
  { name: 'Sarah Green', year: 2020, major: 'Data Science', role: 'Data Scientist', company: 'Netflix', imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800' },
  { name: 'David Lee', year: 2016, major: 'Mechanical Eng.', role: 'Project Engineer', company: 'Tesla', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
  { name: 'Laura Chen', year: 2019, major: 'Biology', role: 'Research Associate', company: 'Genentech', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800' },
  { name: 'Robert Taylor', year: 2011, major: 'Finance', role: 'Investment Banker', company: 'Goldman Sachs', imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800' },
];

const AlumniDirectoryPage = () => {
  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Alumni Directory</h1>
          <p className="mt-4 text-lg text-gray-600">Find old friends, connect with new mentors, and grow your network.</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-16 bg-white bg-opacity-80 backdrop-blur-md z-40 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option>Filter by Year</option>
            <option>2020-2025</option>
            <option>2015-2019</option>
            <option>2010-2014</option>
          </select>
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option>Filter by Major</option>
            <option>Computer Science</option>
            <option>Business</option>
            <option>Engineering</option>
          </select>
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option>Filter by Industry</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
          </select>
        </div>
      </div>

      {/* Alumni Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {alumniData.map((alumni, index) => (
            <motion.div key={index} variants={itemVariants}>
              <AlumniDirectoryCard {...alumni} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default AlumniDirectoryPage;