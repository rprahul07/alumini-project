import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const FilterButton = ({ 
  selectedType, 
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'job', label: 'Job' },
    { value: 'internship', label: 'Internship' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
  ];

  const handleTypeChange = (e) => {
    onFilterChange(e.target.value);
    setIsOpen(false);
  };

  const handleSortChange = (value) => {
    if (value.includes('_')) {
      const [field, order] = value.split('_');
      onSortChange(field, order);
    } else {
      onSortChange(value, 'desc');
    }
    setIsOpen(false);
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => {
      if (sortBy === 'createdAt' && sortOrder === 'desc') return opt.value === 'createdAt';
      if (sortBy === 'createdAt' && sortOrder === 'asc') return opt.value === 'createdAt_asc';
      if (sortBy === 'jobTitle' && sortOrder === 'asc') return opt.value === 'jobTitle';
      if (sortBy === 'jobTitle' && sortOrder === 'desc') return opt.value === 'jobTitle_desc';
      if (sortBy === 'companyName' && sortOrder === 'asc') return opt.value === 'companyName';
      if (sortBy === 'companyName' && sortOrder === 'desc') return opt.value === 'companyName_desc';
      return false;
    });
    return option ? option.label : 'Latest First';
  };

  const getTypeLabel = () => {
    const type = jobTypes.find(t => t.value === selectedType);
    return type ? type.label : 'All Types';
  };

  const DropdownContent = () => (
    <div className="p-6 space-y-6">
      {/* Job Type Filter */}
      <div>
        <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
          Job Type
        </label>
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 text-sm font-body"
        >
          {jobTypes.map((type) => (
            <option key={type.value} value={type.value} className="bg-gray-800 text-white">
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
          Sort By
        </label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 font-body ${
                getSortLabel() === option.label
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 font-semibold border border-primary-400/30'
                  : 'text-white/80 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-xs text-white/60 space-y-2 font-body">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-semibold text-white">{getTypeLabel()}</span>
          </div>
          <div className="flex justify-between">
            <span>Sort:</span>
            <span className="font-semibold text-white">{getSortLabel()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 font-semibold bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:border-primary-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 rounded-2xl whitespace-nowrap group w-full xl:w-auto font-body text-base"
      >
        <FunnelIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-3 w-80 sm:w-72 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 z-[99999] max-h-[80vh] overflow-y-auto scrollbar-hide" style={{ zIndex: 99999 }}>
          {/* Dark gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60 rounded-3xl"></div>
          <div className="relative z-10">
            <DropdownContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton; 