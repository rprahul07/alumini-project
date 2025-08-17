import React from 'react';
import StudentDirectoryCard from '../components/StudentDirectoryCard';
import { motion } from 'framer-motion';

// Placeholder data - later this will come from an API
const studentData = [
  { name: 'Alex Ray', gradYear: 2026, major: 'Computer Science', skills: ['React', 'Node.js', 'Python'], imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800' },
  { name: 'Brenda Song', gradYear: 2025, major: 'Marketing', skills: ['SEO', 'Content Strategy', 'Analytics'], imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800' },
  { name: 'Carlos Gomez', gradYear: 2026, major: 'Mechanical Eng.', skills: ['CAD', '3D Printing', 'Matlab'], imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800' },
  { name: 'Diana Prince', gradYear: 2027, major: 'Graphic Design', skills: ['Figma', 'Illustrator', 'UI/UX'], imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' },
  { name: 'Ethan Hunt', gradYear: 2025, major: 'Finance', skills: ['Excel', 'Valuation', 'Modeling'], imageUrl: 'https://images.unsplash.com/photo-1610088441520-425245f48615?w=800' },
  { name: 'Fiona Glen', gradYear: 2026, major: 'Data Science', skills: ['SQL', 'Tableau', 'R'], imageUrl: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800' },
];

const StudentDirectoryPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Student Directory</h1>
          <p className="mt-4 text-lg text-gray-600">Discover the next generation of talent from our college.</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-16 bg-white bg-opacity-80 backdrop-blur-md z-40 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or skill..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option>Filter by Major</option>
            <option>Computer Science</option>
            <option>Marketing</option>
            <option>Engineering</option>
          </select>
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option>Filter by Graduating Year</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
          </select>
          <button className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300">
            Search
          </button>
        </div>
      </div>

      {/* Student Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {studentData.map((student, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StudentDirectoryCard {...student} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDirectoryPage;