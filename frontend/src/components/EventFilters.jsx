import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const EventFilters = ({ 
  selectedDepartment, 
  selectedType, 
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange,
  isMobile = false // Default to false
}) => {
  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'Civil', label: 'Civil Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'EC', label: 'Electronics & Communication' },
    { value: 'MCA', label: 'Master of Computer Applications' }
  ];

  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'Academic Workshop', label: 'Academic Workshop' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Technical Seminar', label: 'Technical Seminar' },
    { value: 'Industry Conference', label: 'Industry Conference' },
    { value: 'Online Webinar', label: 'Online Webinar' },
    { value: 'Coding Hackathon', label: 'Coding Hackathon' },
    { value: 'Networking Meetup', label: 'Networking Meetup' },
    { value: 'Skill Training', label: 'Skill Training' },
    { value: 'Academic Competition', label: 'Academic Competition' },
    { value: 'Cultural Festival', label: 'Cultural Festival' },
    { value: 'Sports Tournament', label: 'Sports Tournament' },
    { value: 'Career Fair', label: 'Career Fair' },
    { value: 'Research Symposium', label: 'Research Symposium' },
    { value: 'Student Club Event', label: 'Student Club Event' },
    { value: 'Alumni Reunion', label: 'Alumni Reunion' },
    { value: 'Faculty Development', label: 'Faculty Development' },
    { value: 'Other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' },
    { value: 'createdAt', label: 'Created Date' }
  ];

  const handleDepartmentChange = (e) => {
    onFilterChange(e.target.value, selectedType);
  };

  const handleTypeChange = (e) => {
    onFilterChange(selectedDepartment, e.target.value);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    onSortChange(sortBy, e.target.value);
  };

  return (
    <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
      {/* Department Filter */}
      <div className="flex-1">
        <label htmlFor="department" className="block text-sm font-bold text-indigo-700 mb-1">
          Department
        </label>
        <div className="relative">
          <select
            id="department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Event Type Filter */}
      <div className="flex-1">
        <label htmlFor="type" className="block text-sm font-bold text-indigo-700 mb-1">
          Event Type
        </label>
        <div className="relative">
          <select
            id="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="flex-1">
        <label htmlFor="sortBy" className="block text-sm font-bold text-indigo-700 mb-1">
          Sort By
        </label>
        <div className="relative">
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Sort Order */}
      <div className="flex-1">
        <label htmlFor="sortOrder" className="block text-sm font-bold text-indigo-700 mb-1">
          Order
        </label>
        <div className="relative">
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilters; 