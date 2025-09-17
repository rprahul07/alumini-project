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
      <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg text-slate-900 text-xs font-sans hover:bg-white hover:border-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 flex items-center justify-between"
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
          <div className="relative z-10 p-4 space-y-4">
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
              <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">
                Event Time
              </label>
              <div className="flex gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('all')}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all duration-200 font-sans flex items-center whitespace-nowrap ${
                    timeFilter === 'all' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                      : 'text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  All
                  {timeFilter === 'all' && <CheckIcon className="h-3 w-3 ml-1" />}
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('upcoming')}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all duration-200 font-sans flex items-center whitespace-nowrap ${
                    timeFilter === 'upcoming' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                      : 'text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  Upcoming
                  {timeFilter === 'upcoming' && <CheckIcon className="h-3 w-3 ml-1" />}
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('past')}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all duration-200 font-sans flex items-center whitespace-nowrap ${
                    timeFilter === 'past' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                      : 'text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  Past
                  {timeFilter === 'past' && <CheckIcon className="h-3 w-3 ml-1" />}
                </button>
              </div>
            </div>

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
                <div>Type: <span className="font-semibold text-slate-700">{getEventTypeLabel()}</span></div>
                <div>Sort: <span className="font-semibold text-slate-700">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilterButton; 