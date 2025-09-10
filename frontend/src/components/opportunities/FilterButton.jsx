import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

// Custom Dropdown Component
const CustomDropdown = ({ label, options, value, onChange, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 text-sm font-body flex items-center justify-between transition-all duration-200 hover:bg-white/15"
      >
        <span className="text-left">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-hide">
          {/* Dark smoke gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/25 rounded-xl pointer-events-none"></div>
          <div className="relative z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-body transition-all duration-200 flex items-center justify-between hover:bg-white/10 ${
                  value === option.value
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <CheckIcon className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
      <CustomDropdown
        label="Job Type"
        options={jobTypes}
        value={selectedType}
        onChange={onFilterChange}
        placeholder="All Types"
      />

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
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold border border-primary-400/30'
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
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-3 w-80 sm:w-72 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-[99999] max-h-[80vh] overflow-y-auto scrollbar-hide" style={{ zIndex: 99999 }}>
          {/* Dark smoke gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <DropdownContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton; 