import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { 
  XMarkIcon, 
  BuildingOffice2Icon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  CalendarIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const CreateJobModal = ({ onClose, onSuccess, showAlert, editMode = false, jobToEdit = null }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [registrationType, setRegistrationType] = useState('internal');
  const [registrationLink, setRegistrationLink] = useState('');
  const [getEmailNotification, setGetEmailNotification] = useState(true);
  const [jobType, setJobType] = useState('job');
  const [isRemote, setIsRemote] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Only validate location if not remote
    if (!isRemote && !location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // Validate deadline - prevent past dates
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      if (deadlineDate < todayDate) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }
    
    // Validate external registration requirements
    if (registrationType === 'external' && !registrationLink.trim()) {
      newErrors.registrationLink = 'Registration link is required for external registration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Unified prefill for all fields in edit mode
  useEffect(() => {
    if (editMode && jobToEdit) {
      console.log('jobToEdit:', jobToEdit, 'location:', jobToEdit.location);
      if (jobToEdit.location === 'Remote') {
        setIsRemote(true);
        setLocation('');
      } else {
        setIsRemote(false);
        setLocation(jobToEdit.location || '');
      }
      setCompanyName(jobToEdit.companyName || '');
      setJobTitle(jobToEdit.jobTitle || '');
      setDescription(jobToEdit.description || '');
      setDeadline(jobToEdit.deadline ? jobToEdit.deadline.slice(0, 10) : '');
      setRegistrationType(jobToEdit.registrationType || 'internal');
      setRegistrationLink(jobToEdit.registrationLink || '');
      setGetEmailNotification(
        typeof jobToEdit.getEmailNotification === 'boolean'
          ? jobToEdit.getEmailNotification
          : true
      );
      setJobType(jobToEdit.type || 'job');
    } else {
      setIsRemote(false);
      setLocation('');
      setCompanyName('');
      setJobTitle('');
      setDescription('');
      setDeadline('');
      setRegistrationType('internal');
      setRegistrationLink('');
      setGetEmailNotification(true);
      setJobType('job');
      setErrors({});
    }
  }, [editMode, jobToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        companyName,
        jobTitle,
        description,
        deadline: deadline || undefined,
        registrationType,
        registrationLink: registrationType === 'external' ? registrationLink : undefined,
        getEmailNotification: registrationType === 'internal' ? getEmailNotification : undefined,
        jobType,
        location: isRemote ? 'Remote' : location,
      };
      
      if (editMode && jobToEdit) {
        // Update existing job
        await axios.patch(`/api/job/${jobToEdit.id}`, payload);
        showAlert && showAlert('Opportunity updated successfully!', 'success');
      } else {
        // Create new job
        await axios.post('/api/job/', payload);
        showAlert && showAlert('Opportunity created successfully! Pending admin approval.', 'success');
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showAlert && showAlert(editMode ? 'Failed to update opportunity.' : 'Failed to create opportunity.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{editMode ? 'Edit Opportunity' : 'Create New Opportunity'}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {editMode ? 'Update the details of your job or internship opportunity' : 'Fill in the details to create a new job or internship opportunity'}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BriefcaseIcon className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            {/* Location/Remote Section */}
            <div className="flex items-center gap-4 mb-2">
              <input
                type="checkbox"
                id="remote-checkbox"
                checked={isRemote}
                onChange={e => {
                  setIsRemote(e.target.checked);
                  if (e.target.checked) {
                    setLocation('');
                    // Clear location error when remote is selected
                    setErrors(prev => ({ ...prev, location: undefined }));
                  }
                }}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <label htmlFor="remote-checkbox" className="text-sm text-gray-700 select-none cursor-pointer">
                This is a remote opportunity
              </label>
            </div>
            {!isRemote && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={location || ''}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Enter location (e.g., City, Office Address)"
                  required={!isRemote}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input 
                  type="text" 
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={companyName} 
                  onChange={e => setCompanyName(e.target.value)} 
                  required 
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input 
                  type="text" 
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${
                    errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={jobTitle} 
                  onChange={e => setJobTitle(e.target.value)} 
                  required 
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none resize-none min-h-[100px] transition-colors ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Opportunity Type Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Opportunity Type</h3>
            </div>
            
            <div className="flex gap-3">
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 font-medium text-sm shadow-sm flex-1
                ${jobType === 'job' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value="job"
                  checked={jobType === 'job'}
                  onChange={() => setJobType('job')}
                  className="form-radio text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <BriefcaseIcon className="h-5 w-5" />
                <span>Job</span>
              </label>
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 font-medium text-sm shadow-sm flex-1
                ${jobType === 'internship' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value="internship"
                  checked={jobType === 'internship'}
                  onChange={() => setJobType('internship')}
                  className="form-radio text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
                <AcademicCapIcon className="h-5 w-5" />
                <span>Internship</span>
              </label>
            </div>
          </div>

          {/* Application Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Application Settings</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors pr-10 ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    min={today}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
                <div className="relative">
                  <select
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none transition-colors pr-10"
                    value={registrationType}
                    onChange={e => {
                      setRegistrationType(e.target.value);
                      // Clear registration link error when switching types
                      setErrors(prev => ({ ...prev, registrationLink: undefined }));
                    }}
                  >
                    <option value="internal">Internal (Apply on site)</option>
                    <option value="external">External (Redirect to company site)</option>
                  </select>
                  <GlobeAltIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Registration Link (if external) */}
            {registrationType === 'external' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
                <input 
                  type="url" 
                  className={`block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors ${
                    errors.registrationLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={registrationLink} 
                  onChange={e => setRegistrationLink(e.target.value)} 
                  required 
                  placeholder="https://company.com/apply"
                />
                {errors.registrationLink && (
                  <p className="mt-1 text-sm text-red-600">{errors.registrationLink}</p>
                )}
              </div>
            )}
          </div>

          {/* Email Notification Section */}
          {registrationType === 'internal' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <EnvelopeIcon className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Email Notifications</h3>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <label htmlFor="emailNotification" className="text-sm text-gray-700 cursor-pointer select-none font-medium flex-1">
                  Notify me by email when someone applies
                </label>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${getEmailNotification ? 'bg-purple-500' : 'bg-gray-300'}`}
                  onClick={() => setGetEmailNotification(v => !v)}
                  id="emailNotification"
                  aria-pressed={getEmailNotification}
                >
                  <span className="sr-only">Toggle email notification</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${getEmailNotification ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Update Opportunity' : 'Create Opportunity'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal; 