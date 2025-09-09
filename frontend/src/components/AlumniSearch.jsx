import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AlumniSearch = ({ onSearch, isLoading = false }) => {
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
      <div className="relative group">
        <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-300 group-focus-within:text-primary-400 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search alumni..."
          className="w-full pl-7 pr-7 py-3 border border-white/30 bg-white/10 backdrop-blur-sm text-sm text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={isLoading}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/20"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-400 border-t-transparent"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default AlumniSearch; 
 
 