import React, { useState } from 'react';
import axios from '../config/axios';
import { XMarkIcon, CalendarIcon, PhotoIcon, DocumentTextIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';
import { EVENT_TYPES } from '../constants/eventTypes';

const CreateEventModal = ({ isOpen, onClose, onEventCreated, isMobileModal, editMode = false, eventToEdit = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    type: 'Academic Workshop', // Set default to Academic Workshop
    location: '',
    organizer: '',
    description: '',
    maxCapacity: '',
    imageFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  // Prefill form for edit mode
  React.useEffect(() => {
    if (editMode && eventToEdit) {
      setFormData({
        name: eventToEdit.name || '',
        date: eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '',
        time: eventToEdit.time || '',
        type: eventToEdit.type || '',
        location: eventToEdit.location || '',
        organizer: eventToEdit.organizer || '',
        description: eventToEdit.description || '',
        maxCapacity: eventToEdit.maxCapacity || '',
        imageFile: null
      });
      setPhotoPreview(eventToEdit.imageUrl || null);
    } else if (!editMode) {
      setFormData({
        name: '',
        date: '',
        time: '',
        type: 'Academic Workshop', // Set default to Academic Workshop
        location: '',
        organizer: '',
        description: '',
        maxCapacity: '',
        imageFile: null
      });
      setPhotoPreview(null);
    }
  }, [editMode, eventToEdit, isOpen]);

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, imageFile: 'Please select a valid image file (JPG, PNG, WebP)' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageFile: 'Image size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      setPhotoPreview(URL.createObjectURL(file));
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = 'Event date cannot be in the past. Please select today or a future date.';
    }
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.type) newErrors.type = 'Event type is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';
    if (formData.maxCapacity && (formData.maxCapacity < 1 || formData.maxCapacity > 1000)) newErrors.maxCapacity = 'Capacity must be between 1 and 1000';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      if (!user) {
        toast.error('Please log in to create events');
        return;
      }
      let endpoint = null;
      let method = 'post';
      if (editMode && eventToEdit) {
        // PATCH endpoint for edit
        if (user.role === 'admin') endpoint = `/api/admin/event/${eventToEdit.id}`;
        else if (user.role === 'faculty') endpoint = `/api/faculty/event/${eventToEdit.id}`;
        else if (user.role === 'alumni') endpoint = `/api/alumni/event/${eventToEdit.id}`;
        method = 'patch';
      } else {
        if (user.role === 'admin') endpoint = '/api/admin/event/create';
        else if (user.role === 'faculty') endpoint = '/api/faculty/event/create';
        else if (user.role === 'alumni') endpoint = '/api/alumni/event/create';
      }
      if (!endpoint) {
        toast.error('Your role is not allowed to create or edit events.');
        return;
      }
      let successMessage = editMode
        ? 'Event updated successfully!'
        : user.role === 'admin'
          ? 'Event published successfully!'
          : 'Event created successfully! It will be reviewed by the admin.';
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('type', formData.type);
      submitData.append('location', formData.location);
      submitData.append('organizer', formData.organizer);
      submitData.append('description', formData.description);
      if (formData.maxCapacity) submitData.append('maxCapacity', Number(formData.maxCapacity));
      if (formData.imageFile) submitData.append('photo', formData.imageFile);
      if (!editMode && user.role === 'admin') submitData.append('status', 'approved');
      let response;
      if (method === 'patch') {
        response = await axios.patch(endpoint, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post(endpoint, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (response.data.success) {
        toast.success(successMessage);
        handleClose();
        if (onEventCreated) onEventCreated(response.data.data);
      } else {
        toast.error(response.data.message || (editMode ? 'Failed to update event' : 'Failed to create event'));
      }
    } catch (error) {
      console.error('Create/edit event error:', error);
      if (error.response?.status === 401) toast.error('Please log in to create or edit events');
      else if (error.response?.status === 403) toast.error('Access denied. Only alumni, faculty, and admin can create or edit events.');
      else if (error.response?.data?.message) toast.error(error.response.data.message);
      else toast.error('Network error. Please try again.');
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
      type: 'Academic Workshop', // Set default to Academic Workshop
      location: '',
      organizer: '',
      description: '',
      maxCapacity: '',
      imageFile: null
    });
    setErrors({});
    setPhotoPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{editMode ? 'Edit Event' : 'Create New Event'}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {editMode ? 'Update the details of your event' : 'Fill in the details to create a new event'}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  {EVENT_TYPES.filter(t => t.value !== '').map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.organizer ? 'border-red-500' : 'border-gray-300'}`}
                  required
                  placeholder="Enter organizer name"
                  maxLength={100}
                />
                {errors.organizer && <p className="mt-1 text-sm text-red-600">{errors.organizer}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity (Optional)</label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${errors.maxCapacity ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter max capacity"
                  min="1"
                  max="1000"
                />
                {errors.maxCapacity && <p className="mt-1 text-sm text-red-600">{errors.maxCapacity}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Enter event description"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Image (Optional)</label>
              <div className="mt-1 flex justify-center px-2 pt-3 pb-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Event" className="mx-auto h-20 w-20 object-cover rounded-lg mb-2" />
                  ) : (
                    <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
                  )}
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
          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default CreateEventModal; 