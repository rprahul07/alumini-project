import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const JobSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search jobs by title, company, or description..."
        className="block w-full pl-10 pr-3 py-2 border-2 border-white/40 rounded-full leading-5 bg-white/40 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-lg transition-all text-sm sm:text-base"
      />
    </div>
  );
};

export default JobSearch; 