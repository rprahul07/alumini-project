import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { 
  XMarkIcon, 
  BriefcaseIcon, 
  CalendarIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom';

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

  if (!onClose) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide border border-slate-200" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="h-5 w-5 text-primary-600" />
            </div>
            {editMode ? 'Edit Opportunity' : 'Create New Opportunity'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Location/Remote Section */}
          <div className="bg-slate-50 backdrop-blur-xl rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-4">
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
                className="h-4 w-4 text-primary-400 focus:ring-primary-500 border-slate-300 rounded bg-slate-50"
              />
              <label htmlFor="remote-checkbox" className="text-sm text-slate-700 select-none cursor-pointer font-medium">
                This is a remote opportunity
              </label>
            </div>
          </div>
          {!isRemote && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Location
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 placeholder-slate-500 ${
                  errors.location ? 'border-red-400/50 bg-red-500/10' : 'border-slate-300'
                }`}
                value={location || ''}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter location (e.g., City, Office Address)"
                required={!isRemote}
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.location}
                </p>
              )}
            </div>
          )}
            
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Company Name
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 placeholder-slate-500 ${
                  errors.companyName ? 'border-red-400/50 bg-red-500/10' : 'border-slate-300'
                }`}
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
                placeholder="Enter company name"
                required 
              />
              {errors.companyName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.companyName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Job Title
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 placeholder-slate-500 ${
                  errors.jobTitle ? 'border-red-400/50 bg-red-500/10' : 'border-slate-300'
                }`}
                value={jobTitle} 
                onChange={e => setJobTitle(e.target.value)} 
                placeholder="Enter job title"
                required 
              />
              {errors.jobTitle && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.jobTitle}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Description
            </label>
            <textarea 
              className={`w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 placeholder-slate-500 resize-none min-h-[120px] ${
                errors.description ? 'border-red-400/50 bg-red-500/10' : 'border-slate-300'
              }`}
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Describe the role, responsibilities, and requirements..."
              required 
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.description}
              </p>
            )}
          </div>

          {/* Opportunity Type Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Opportunity Type
            </label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-3 px-6 py-4 rounded-xl border cursor-pointer transition-all duration-300 font-medium text-sm shadow-lg flex-1 backdrop-blur-xl
                ${jobType === 'job' ? 'bg-gradient-to-r from-primary-100 to-secondary-100 border-primary-300 text-primary-700 ring-2 ring-primary-300' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'}`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value="job"
                  checked={jobType === 'job'}
                  onChange={() => setJobType('job')}
                  className="form-radio text-primary-600 focus:ring-primary-500 accent-primary-600"
                />
                <BriefcaseIcon className="h-5 w-5" />
                <span>Job</span>
              </label>
              <label className={`flex items-center gap-3 px-6 py-4 rounded-xl border cursor-pointer transition-all duration-300 font-medium text-sm shadow-lg flex-1 backdrop-blur-xl
                ${jobType === 'internship' ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-700 ring-2 ring-green-300' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'}`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value="internship"
                  checked={jobType === 'internship'}
                  onChange={() => setJobType('internship')}
                  className="form-radio text-green-600 focus:ring-green-500 accent-green-600"
                />
                <AcademicCapIcon className="h-5 w-5" />
                <span>Internship</span>
              </label>
            </div>
          </div>

          {/* Application Settings Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  className={`w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 placeholder-slate-500 pr-10 ${
                    errors.deadline ? 'border-red-400/50 bg-red-500/10' : 'border-slate-300'
                  }`}
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  min={today}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
              </div>
              {errors.deadline && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.deadline}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Registration Type
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 appearance-none pr-10"
                  value={registrationType}
                  onChange={e => {
                    setRegistrationType(e.target.value);
                    // Clear registration link error when switching types
                    setErrors(prev => ({ ...prev, registrationLink: undefined }));
                  }}
                >
                  <option value="internal" className="bg-slate-50 text-slate-900">Internal (Apply on site)</option>
                  <option value="external" className="bg-slate-50 text-slate-900">External (Redirect to company site)</option>
                </select>
                <GlobeAltIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Registration Link (if external) */}
          {registrationType === 'external' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Registration Link
              </label>
              <input 
                type="url" 
                className={`w-full px-4 py-3 bg-slate-50 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-400/50 text-slate-900 placeholder-slate-500 ${
                  errors.registrationLink ? 'border-red-400/50 bg-red-500/10' : 'border-slate-300'
                }`}
                value={registrationLink} 
                onChange={e => setRegistrationLink(e.target.value)} 
                required 
                placeholder="https://company.com/apply"
              />
              {errors.registrationLink && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.registrationLink}
                </p>
              )}
            </div>
          )}

          {/* Email Notification Section */}
          {registrationType === 'internal' && (
            <div className="bg-slate-50 backdrop-blur-xl rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-4">
                <label htmlFor="emailNotification" className="text-sm text-slate-700 cursor-pointer select-none font-medium flex-1">
                  Notify me by email when someone applies
                </label>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${getEmailNotification ? 'bg-primary-500' : 'bg-white/20'}`}
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
          <div className="flex justify-between gap-4 pt-6 border-t border-slate-200">
            <button 
              type="button" 
              className="px-6 py-3 font-semibold bg-slate-100 backdrop-blur-xl border border-slate-300 text-slate-700 hover:bg-slate-200 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
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

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateJobModal; 