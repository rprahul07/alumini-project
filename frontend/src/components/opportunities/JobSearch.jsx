import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const JobSearch = ({ onSearch, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search jobs by title or description..."
          className="w-full pl-10 pr-10 py-2 border-2 border-indigo-400 bg-white/60 backdrop-blur text-sm text-gray-700 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          disabled={isLoading}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default JobSearch; 