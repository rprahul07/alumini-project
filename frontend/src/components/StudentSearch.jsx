import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const StudentSearch = ({ searchTerm, onSearchChange, isLoading = false }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <div className="relative group">
        <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Search students..."
          className="w-full pl-7 pr-7 py-3 border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
          disabled={isLoading}
        />
        {localSearchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default StudentSearch; 