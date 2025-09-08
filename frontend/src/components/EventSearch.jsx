import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const EventSearch = ({ searchTerm, onSearchChange, isLoading = false }) => {
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
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-primary-400 transition-colors" />
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl font-body text-base"
          disabled={isLoading}
        />
        {localSearchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-primary-400"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EventSearch; 