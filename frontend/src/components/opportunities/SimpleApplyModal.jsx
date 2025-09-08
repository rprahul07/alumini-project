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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-md shadow-2xl border border-white/20 relative animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-xl px-6 py-4 border-b border-white/20 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-display">Apply for Job</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 border border-white/30"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-1 font-body">{job.jobTitle} at {job.companyName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {job.registrationType === 'external' ? (
            // External Application Flow
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center border border-primary-400/30">
                    <UserIcon className="h-6 w-6 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg font-display">External Application</h3>
                    <p className="text-sm text-white/80 font-body">This job requires external application</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                  <p className="text-sm text-white/90 mb-2 font-body">
                    You will be redirected to the company's application portal.
                  </p>
                  <p className="text-xs text-white/70 font-body">
                    You can complete your profile later if needed.
                  </p>
                </div>
              </div>

              {/* Apply Button for External */}
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold hover:from-primary-600 hover:to-secondary-600 disabled:bg-gray-500/20 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 font-body"
              >
                {applying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Apply via External Link
                  </>
                )}
              </button>
            </>
          ) : (
            // Internal Application Flow
            <>
              {/* Profile Edit Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center border border-primary-400/30">
                    <UserIcon className="h-6 w-6 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg font-display">Update Your Profile</h3>
                    <p className="text-sm text-white/80 font-body">Ensure your profile is complete before applying</p>
                  </div>
                </div>
                <button
                  onClick={openProfileEdit}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-body"
                >
                  Edit Profile
                </button>
              </div>

              {/* CV Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-400/30">
                    <DocumentTextIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg font-display">Upload CV</h3>
                    <p className="text-sm text-white/80 font-body">Upload your resume for this application</p>
                  </div>
                </div>

                {/* Current CV Display */}
                {user.resumeUrl && !cvFile && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <PaperClipIcon className="h-5 w-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white font-body">Current CV</p>
                        <a 
                          href={user.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-green-400 hover:text-green-300 underline font-body"
                        >
                          View CV
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* New CV Upload */}
                {cvFile && (
                  <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <PaperClipIcon className="h-5 w-5 text-primary-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white font-body">New CV Uploaded</p>
                        <p className="text-xs text-white/70 font-body">{cvFile.file.name}</p>
                      </div>
                      <button
                        onClick={() => setCvFile(null)}
                        className="text-white/60 hover:text-white transition-colors"
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
                    className={`block w-full p-6 border-2 border-dashed rounded-2xl text-center transition-all duration-300 ${
                      cvUploading 
                        ? 'border-primary-400/50 bg-primary-500/10 cursor-not-allowed' 
                        : 'border-white/30 bg-white/5 hover:border-primary-400/50 hover:bg-primary-500/10 cursor-pointer'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {cvUploading ? (
                        <>
                          <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-primary-400 font-medium font-body">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div>
                            <span className="text-sm font-medium text-white font-body">Upload New CV</span>
                            <p className="text-xs text-white/60 mt-1 font-body">PDF, DOC, or DOCX (max 5MB)</p>
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
                className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold hover:from-primary-600 hover:to-secondary-600 disabled:bg-gray-500/20 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 font-body"
              >
                {applying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Apply Now
                  </>
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