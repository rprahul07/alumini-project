import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
  XMarkIcon, 
  PaperClipIcon, 
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const SimpleApplyModal = ({ open, onClose, job, showAlert, onSuccess }) => {
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [applying, setApplying] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!open || !job) return null;

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      toast.error('Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }
    
    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('chunk', file);
      formData.append('filename', file.name);
      formData.append('chunkIndex', '0');
      formData.append('totalChunks', '1');
      const uploadEndpoint = `/api/${user.role}/upload/resume`;
      const res = await axios.post(uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success && res.data.url) {
              setCvFile({ file, url: res.data.url });
      } else {
        throw new Error(res.data.message || 'Failed to upload CV');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload CV');
    } finally {
      setCvUploading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await axios.post(`/api/job/${job.id}/register`);
      
      if (response.data.success) {
        if (job.registrationType === 'external') {
          // For external jobs, redirect to the registration link
          toast.success('Redirecting to external application...');
          setTimeout(() => {
            window.open(response.data.data.registrationLink, '_blank');
            onClose();
            if (onSuccess) onSuccess();
          }, 1000);
        } else {
          // For internal jobs, show success message
          toast.success('Application submitted successfully!');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 1000);
        }
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You have already applied for this job.');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const openProfileEdit = () => {
    // Navigate to profile edit page
    onClose(); // Close the apply modal
    navigate('/profile/edit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Apply for Job</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{job.jobTitle} at {job.companyName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {job.registrationType === 'external' ? (
            // External Application Flow
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">External Application</h3>
                    <p className="text-sm text-gray-600">This job requires external application</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800 mb-2">
                    You will be redirected to the company's application portal.
                  </p>
                  <p className="text-xs text-blue-600">
                    You can complete your profile later if needed.
                  </p>
                </div>
              </div>

              {/* Apply Button for External */}
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirecting...
                  </>
                ) : (
                  'Apply via External Link'
                )}
              </button>
            </>
          ) : (
            // Internal Application Flow
            <>
              {/* Profile Edit Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Update Your Profile</h3>
                    <p className="text-sm text-gray-600">Ensure your profile is complete before applying</p>
                  </div>
                </div>
                <button
                  onClick={openProfileEdit}
                  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* CV Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Upload CV</h3>
                    <p className="text-sm text-gray-600">Upload your resume for this application</p>
                  </div>
                </div>

                {/* Current CV Display */}
                {user.resumeUrl && !cvFile && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <PaperClipIcon className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Current CV</p>
                        <a 
                          href={user.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-green-600 hover:text-green-800 underline"
                        >
                          View CV
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* New CV Upload */}
                {cvFile && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <PaperClipIcon className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800">New CV Uploaded</p>
                        <p className="text-xs text-blue-600">{cvFile.file.name}</p>
                      </div>
                      <button
                        onClick={() => setCvFile(null)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleCvChange} 
                    disabled={cvUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="cv-upload"
                  />
                  <label 
                    htmlFor="cv-upload"
                    className={`block w-full p-4 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
                      cvUploading 
                        ? 'border-blue-200 bg-blue-50 cursor-not-allowed' 
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {cvUploading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-600 font-medium">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Upload New CV</span>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Apply Button for Internal */}
              <button
                onClick={handleApply}
                disabled={applying || (!user.resumeUrl && !cvFile)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Applying...
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleApplyModal; 