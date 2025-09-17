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
        <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-6 pr-6 py-2 border border-slate-300 bg-white/80 backdrop-blur-sm text-xs text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
          disabled={isLoading}
        />
        {localSearchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default EventSearch; 