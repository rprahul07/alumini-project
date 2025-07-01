import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../config/axios';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditEventModal = ({ isOpen, onClose, event, onEventUpdated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: event.time || '',
        location: event.location || '',
        organizer: event.organizer || '',
        type: event.type || '',
        maxCapacity: event.maxCapacity || '',
      });
      setPhotoPreview(event.imageUrl || null);
      setPhotoFile(null);
    }
  }, [event]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Keep the value as a number if the input type is 'number'
    const processedValue = type === 'number' ? (value ? Number(value) : '') : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let endpoint = '';
      if (user.role === 'admin') {
        endpoint = `/api/admin/event/${event.id}`;
      } else if (user.role === 'faculty') {
        endpoint = `/api/faculty/event/${event.id}`;
      } else if (user.role === 'alumni') {
        endpoint = `/api/alumni/event/${event.id}`;
      }

      let response;
      if (photoFile) {
        // Use FormData for file upload
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) form.append(key, value);
        });
        form.append('maxCapacity', formData.maxCapacity ? Number(formData.maxCapacity) : '');
        form.append('photo', photoFile);
        response = await axios.patch(endpoint, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // No photo, send as JSON
        const dataToSend = {
          ...formData,
          maxCapacity: formData.maxCapacity ? Number(formData.maxCapacity) : undefined,
        };
        response = await axios.patch(endpoint, dataToSend);
      }

      if (response && response.data && response.data.success) {
        toast.success('Event updated successfully!');
        if (onEventUpdated) {
          onEventUpdated(response.data.data);
        }
        onClose();
      } else {
        toast.error(response?.data?.message || 'Failed to update event.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-1 sm:p-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-2 sm:p-4 max-h-[80vh] overflow-y-auto scrollbar-none">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base sm:text-lg font-bold">Edit Event</h2>
          <button onClick={onClose}><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 text-sm sm:text-base">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Photo</label>
            <div className="flex items-center gap-4 mt-1">
              <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center overflow-hidden border">
                {photoPreview ? (
                  <img src={photoPreview} alt="Event" className="object-cover w-full h-full" loading="lazy" />
                ) : (
                  <span className="text-gray-400 text-xs">No Photo</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="block text-sm" />
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" name="time" id="time" value={formData.time} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
          
          {/* Location and Organizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
              <input type="text" name="organizer" id="organizer" value={formData.organizer} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          {/* Type and Max Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Event Type</label>
              <input type="text" name="type" id="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input type="number" name="maxCapacity" id="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
          
          <div className="pt-2 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 w-full sm:w-auto">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-blue-300 w-full sm:w-auto">
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal; 