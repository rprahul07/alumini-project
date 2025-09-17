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
      <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-xs font-sans flex items-center justify-between transition-all duration-200 hover:bg-white"
      >
        <span className="text-left">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto scrollbar-hide">
          {/* Light gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-slate-100/50 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-sans transition-all duration-200 flex items-center justify-between hover:bg-slate-100 ${
                  value === option.value
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <CheckIcon className="h-3 w-3 text-white" />
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
    <div className="p-4 space-y-4">
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
        <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">
          Sort By
        </label>
        <div className="space-y-0.5">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 font-sans flex items-center justify-between hover:bg-slate-100 ${
                getSortLabel() === option.label
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>{option.label}</span>
              {getSortLabel() === option.label && (
                <CheckIcon className="h-3 w-3 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="pt-3 border-t border-slate-200">
        <div className="text-xs text-slate-600 space-y-1 font-sans">
          <div>Type: <span className="font-semibold text-slate-700">{getTypeLabel()}</span></div>
          <div>Sort: <span className="font-semibold text-slate-700">{getSortLabel()}</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 font-semibold bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 hover:bg-white hover:border-primary-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 rounded-xl whitespace-nowrap group w-full xl:w-auto font-sans text-sm"
      >
        <FunnelIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-72 sm:w-64 bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-slate-200 z-[99999] max-h-[70vh] overflow-y-auto scrollbar-hide" style={{ zIndex: 99999 }}>
          {/* Light gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-slate-100/50 rounded-xl pointer-events-none"></div>
          <div className="relative z-10">
            <DropdownContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton; 