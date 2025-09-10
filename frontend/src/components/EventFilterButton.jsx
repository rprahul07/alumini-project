import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { EVENT_TYPES } from '../constants/eventTypes';

// Custom Dropdown Component
const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = ""
}) => {
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
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm font-body hover:bg-white/20 hover:border-primary-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 flex items-center justify-between"
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

const EventFilterButton = ({ 
  selectedEventType, 
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange, 
  timeFilter = 'all',
  onTimeFilterChange,
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

  // Use shared event types for dropdown
  const eventTypeOptions = EVENT_TYPES;

  // Only the required sort options
  const sortOptions = [
    { value: 'createdAt_desc', label: 'Latest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
    { value: 'date_asc', label: 'Date (Earliest)' },
    { value: 'date_desc', label: 'Date (Latest)' }
  ];

  const handleEventTypeChange = (e) => {
    onFilterChange('eventType', e.target.value);
    setIsOpen(false);
  };

  const handleSortChange = (value) => {
      const [field, order] = value.split('_');
      onSortChange(field, order);
    setIsOpen(false);
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === `${sortBy}_${sortOrder}`);
    return option ? option.label : 'Latest First';
  };

  const getEventTypeLabel = () => {
    const type = eventTypeOptions.find(t => t.value === selectedEventType);
    return type ? type.label : 'All Types';
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 font-semibold bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:border-primary-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 rounded-2xl whitespace-nowrap group w-full xl:w-auto font-body text-base"
      >
        <FunnelIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-72 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-[99999] max-h-[80vh] overflow-y-auto scrollbar-hide">
          {/* Dark smoke gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10 p-6 space-y-6">
            {/* Event Type Filter */}
            <CustomDropdown
              label="Event Type"
              options={eventTypeOptions}
              value={selectedEventType}
              onChange={(value) => onFilterChange('eventType', value)}
              placeholder="All Types"
            />

            {/* Event Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
                Event Time
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('all')}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all duration-200 font-body flex items-center ${
                    timeFilter === 'all' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                      : 'text-white/90 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  All
                  {timeFilter === 'all' && <CheckIcon className="h-4 w-4 ml-2" />}
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('upcoming')}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all duration-200 font-body flex items-center ${
                    timeFilter === 'upcoming' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                      : 'text-white/90 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  Upcoming
                  {timeFilter === 'upcoming' && <CheckIcon className="h-4 w-4 ml-2" />}
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('past')}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all duration-200 font-body flex items-center ${
                    timeFilter === 'past' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                      : 'text-white/90 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  Past
                  {timeFilter === 'past' && <CheckIcon className="h-4 w-4 ml-2" />}
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
                Sort By
              </label>
              <div className="space-y-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 font-body flex items-center justify-between hover:bg-white/10 ${
                      getSortLabel() === option.label
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    {getSortLabel() === option.label && (
                      <CheckIcon className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="pt-4 border-t border-white/20">
              <div className="text-xs text-white/70 space-y-2 font-body">
                <div>Type: <span className="font-semibold text-white/90">{getEventTypeLabel()}</span></div>
                <div>Sort: <span className="font-semibold text-white/90">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilterButton; 