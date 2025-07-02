import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const CreateEventModal = ({ isOpen, onClose, onEventCreated, isMobileModal }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    type: '',
    department: '',
    location: '',
    organizer: '',
    description: '',
    maxCapacity: '',
    imageFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Event types (same as EventFilters for consistency)
  const eventTypes = [
    { value: '', label: 'Select Event Type' },
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

  // Departments (same as EventFilters for consistency)
  const departments = [
    { value: '', label: 'Select Department' },
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'Civil', label: 'Civil Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'EC', label: 'Electronics & Communication' },
    { value: 'MCA', label: 'Master of Computer Applications' }
  ];

  // Locations (best practices)
  const locations = [
    { value: '', label: 'Select Location' },
    { value: 'Main Auditorium', label: 'Main Auditorium' },
    { value: 'Seminar Hall A', label: 'Seminar Hall A' },
    { value: 'Seminar Hall B', label: 'Seminar Hall B' },
    { value: 'Computer Lab 1', label: 'Computer Lab 1' },
    { value: 'Computer Lab 2', label: 'Computer Lab 2' },
    { value: 'Engineering Block', label: 'Engineering Block' },
    { value: 'Library Conference Room', label: 'Library Conference Room' },
    { value: 'Sports Complex', label: 'Sports Complex' },
    { value: 'Open Air Amphitheater', label: 'Open Air Amphitheater' },
    { value: 'Online (Zoom/Teams)', label: 'Online (Zoom/Teams)' },
    { value: 'Hybrid (On-campus + Online)', label: 'Hybrid (On-campus + Online)' },
    { value: 'Other', label: 'Other' }
  ];

  if (!isOpen) return null;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          imageFile: 'Please select a valid image file (JPG, PNG, WebP)'
        }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imageFile: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      if (errors.imageFile) {
        setErrors(prev => ({
          ...prev,
          imageFile: ''
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Event date must be in the future';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Event type is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required';
    }
    
    if (formData.maxCapacity && (formData.maxCapacity < 1 || formData.maxCapacity > 1000)) {
      newErrors.maxCapacity = 'Capacity must be between 1 and 1000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!user) {
        alert('Please log in to create events');
        return;
      }
      
      // Debug log for role
      console.log('Creating event as:', user.role);
      let endpoint = null;
      if (user.role === 'admin') endpoint = '/api/admin/event/create';
      else if (user.role === 'faculty') endpoint = '/api/faculty/event/create';
      else if (user.role === 'alumni') endpoint = '/api/alumni/event/create';
      if (!endpoint) {
        alert('Your role is not allowed to create events.');
        return;
      }
      let successMessage;
      successMessage = user.role === 'admin'
        ? 'Event published successfully!'
        : 'Event created successfully! It will be reviewed by the admin.';
      
      // Prepare FormData for submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('type', formData.type);
      submitData.append('department', formData.department);
      submitData.append('location', formData.location);
      submitData.append('organizer', formData.organizer);
      submitData.append('description', formData.description);
      // Simplified: Only append maxCapacity if present and valid, always as a number
      if (formData.maxCapacity) {
        submitData.append('maxCapacity', Number(formData.maxCapacity));
      }
      if (formData.imageFile) {
        submitData.append('photo', formData.imageFile);
      }
      // If admin, set status to approved
      if (user.role === 'admin') {
        submitData.append('status', 'approved');
      }
      
      const response = await axios.post(endpoint, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert(successMessage); // Use the dynamic success message
        handleClose();
        if (onEventCreated) {
          onEventCreated();
        }
      } else {
        alert(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      
      if (error.response?.status === 401) {
        alert('Please log in to create events');
      } else if (error.response?.status === 403) {
        alert('Access denied. Only alumni, faculty, and admin can create events.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleClose = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      type: '',
      department: '',
      location: '',
      organizer: '',
      description: '',
      maxCapacity: '',
      imageFile: null
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-1 sm:p-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-3 max-h-[80vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Create New Event</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Event Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            {/* Date and Time */}
            <div>
              <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.date ? 'border-red-500' : 'border-gray-300'} text-sm`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Event Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.time ? 'border-red-500' : 'border-gray-300'} text-sm`}
              />
              {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
            </div>
            {/* Event Type and Department */}
            <div>
              <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Event Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.type ? 'border-red-500' : 'border-gray-300'} text-sm`}
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>
            <div>
              <label htmlFor="department" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.department ? 'border-red-500' : 'border-gray-300'} text-sm`}
              >
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
            </div>
            {/* Location and Organizer */}
            <div>
              <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.location ? 'border-red-500' : 'border-gray-300'} text-sm`}
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>
            <div>
              <label htmlFor="organizer" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Organizer *
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.organizer ? 'border-red-500' : 'border-gray-300'} text-sm`}
                placeholder="Enter organizer name"
                maxLength={100}
              />
              {errors.organizer && <p className="mt-1 text-xs text-red-600">{errors.organizer}</p>}
            </div>
            {/* Max Capacity */}
            <div>
              <label htmlFor="maxCapacity" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Max Capacity (Optional)
              </label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.maxCapacity ? 'border-red-500' : 'border-gray-300'} text-sm`}
                placeholder="Enter max capacity"
                min="1"
                max="1000"
              />
              {errors.maxCapacity && <p className="mt-1 text-xs text-red-600">{errors.maxCapacity}</p>}
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Enter event description"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Event Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-2 pt-3 pb-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-xs text-gray-600">
                    <label
                      htmlFor="imageFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 5MB
                  </p>
                  {formData.imageFile && (
                    <p className="text-xs text-green-600">
                      Selected: {formData.imageFile.name}
                    </p>
                  )}
                </div>
              </div>
              {errors.imageFile && <p className="mt-1 text-xs text-red-600">{errors.imageFile}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full px-4 py-1.5 font-semibold bg-gray-200 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-4 py-1.5 font-semibold bg-blue-600 text-white disabled:bg-blue-300 w-full sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 