import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import useAlert from '../hooks/useAlert';
import RoleSpecificProfileForm from './RoleSpecificProfileForm';
import { useAuth } from '../contexts/AuthContext';
import {
  CameraIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon,
  PaperClipIcon,
  XMarkIcon as TagRemoveIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';

const ProfileEditor = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null,
    userRole: '',
    bio: '',
    department: '',
    linkedinUrl: '',
    twitterUrl: '',
    githubUrl: '',
    highestQualification: '',
    totalExperience: '',
    currentSemester: '',
    rollNumber: '',
    graduationYear: '',
    batch_startYear: '',
    batch_endYear: '',
    currentJobTitle: '',
    companyName: '',
    company_role: '',
    course: '',
    designation: '',
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [cvUploading, setCvUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!user) {
          showAlert('User data not found. Please log in again.', 'error');
          navigate('/auth');
          return;
        }
        const getEndpoint = user.role === 'admin' ? `/api/${user.role}/profile` : `/api/${user.role}/profile/get/`;

        const response = await axios.get(getEndpoint, { withCredentials: true });

        if (response.data.success) {
          const profileData = response.data.data;
          const newFormData = {
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            profilePhoto: profileData.photoUrl || null,
            userRole: profileData.role || '',
            bio: profileData.bio || '',
            department: profileData.department || '',
            linkedinUrl: profileData.linkedinUrl || '',
            twitterUrl: profileData.twitterUrl || '',
            githubUrl: profileData.githubUrl || '',
            highestQualification: profileData.highestQualification || '',
            totalExperience: profileData.totalExperience || '',
            currentSemester: '',
            rollNumber: '',
            graduationYear: '',
            currentJobTitle: '',
            companyName: '',
            course: '',
            designation: '',
          };
          if (profileData.role === 'student' && profileData.student) {
            newFormData.currentSemester = profileData.student.currentSemester?.toString() || '';
            newFormData.rollNumber = profileData.student.rollNumber || '';
            newFormData.graduationYear = profileData.student.graduationYear?.toString() || '';
            newFormData.batch_startYear = profileData.student.batch_startYear?.toString() || '';
            newFormData.batch_endYear = profileData.student.batch_endYear?.toString() || '';
          } else if (profileData.role === 'alumni' && profileData.alumni) {
            newFormData.graduationYear = profileData.alumni.graduationYear?.toString() || '';
            newFormData.currentJobTitle = profileData.alumni.currentJobTitle || '';
            newFormData.companyName = profileData.alumni.companyName || '';
            newFormData.company_role = profileData.alumni.company_role || '';
            newFormData.course = profileData.alumni.course || '';
          } else if (profileData.role === 'faculty' && profileData.faculty) {
            newFormData.designation = profileData.faculty.designation || '';
          }
          setFormData(newFormData);

          if (profileData.skills && Array.isArray(profileData.skills)) {
            setSkills(profileData.skills);
          } else {

            setSkills([]);
          }
          if (profileData.resumeUrl) setResumeUrl(profileData.resumeUrl);
        } else {
          setError(response.data.message || 'Failed to load profile data');
          showAlert(response.data.message || 'Failed to load profile data', 'error');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile data. Please check your network or server.');
        showAlert(error.response?.data?.message || 'Failed to load profile data. Please check your network or server.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, profilePhoto: files[0] }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {

      setSkills([...skills, skill]);
      setNewSkill('');
    }
  };
  const handleSkillRemove = (skill) => {

    setSkills(skills.filter(s => s !== skill));
  };
  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      showAlert('Please upload a PDF, DOC, or DOCX file.', 'error');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('File size must be less than 5MB.', 'error');
      return;
    }

    console.log('📤 Uploading CV file:', file.name, 'Size:', file.size);
    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('chunk', file); // file field
      formData.append('filename', file.name); // required by backend
      formData.append('chunkIndex', '0'); // single file
      formData.append('totalChunks', '1'); // single file
      // Use correct endpoint based on role
      const uploadEndpoint = `/api/${user.role}/upload/resume`;

      const res = await axios.post(uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success && res.data.url) {
        setResumeUrl(res.data.url);
        showAlert('CV uploaded successfully!', 'success');
      } else {
        showAlert(res.data.message || 'Failed to upload CV', 'error');
      }
    } catch (err) {

      showAlert('Failed to upload CV', 'error');
    } finally {
      setCvUploading(false);
    }
  };

  const redirectToDashboard = () => {
    setTimeout(() => {
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'alumni':
          navigate('/alumni/dashboard');
          break;
        case 'faculty':
          navigate('/faculty/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User data not found');

      // Validation checks
      if (!formData.fullName || formData.fullName.trim() === '') {
        throw new Error('Full name is required');
      }
      if (!formData.email || formData.email.trim() === '') {
        throw new Error('Email is required');
      }


      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('linkedinUrl', formData.linkedinUrl || '');
      formDataToSend.append('twitterUrl', formData.twitterUrl || '');
      formDataToSend.append('githubUrl', formData.githubUrl || '');

      // Only add professional fields for alumni (faculty doesn't support these fields in backend)
      if (user.role === 'alumni') {
        formDataToSend.append('highestQualification', formData.highestQualification || '');
        formDataToSend.append('totalExperience', formData.totalExperience || '');
      }
      if (user.role === 'student') {
        if (formData.currentSemester) {
          formDataToSend.append('currentSemester', formData.currentSemester);
        }
        formDataToSend.append('rollNumber', formData.rollNumber || '');
        if (formData.graduationYear) {
          formDataToSend.append('graduationYear', formData.graduationYear);
        }
        if (formData.batch_startYear) {
          formDataToSend.append('batch_startYear', formData.batch_startYear);
        }
        if (formData.batch_endYear) {
          formDataToSend.append('batch_endYear', formData.batch_endYear);
        }
      } else if (user.role === 'alumni') {
        if (formData.graduationYear) {
          formDataToSend.append('graduationYear', formData.graduationYear);
        }
        formDataToSend.append('currentJobTitle', formData.currentJobTitle || '');
        formDataToSend.append('companyName', formData.companyName || '');
        formDataToSend.append('company_role', formData.company_role || '');
        formDataToSend.append('course', formData.course || '');
      } else if (user.role === 'faculty') {
        formDataToSend.append('designation', formData.designation || '');
      }
      // Only include skills and resumeUrl for students and alumni
      if (user.role === 'student' || user.role === 'alumni') {

        skills.forEach((skill, index) => {

          formDataToSend.append('skills', skill);
        });
        if (resumeUrl) {

          formDataToSend.append('resumeUrl', resumeUrl);
        }
      }
      if (formData.profilePhoto instanceof File) {
        formDataToSend.append('photo', formData.profilePhoto);
      }

      // Validate endpoint and make request
      const endpoint = `/api/${user.role}/profile/update`;
      console.log('📤 Sending update request to:', endpoint);
      console.log('🔐 User auth context:', { id: user?.id, role: user?.role, email: user?.email });

      // Debug FormData contents more thoroughly
      console.log('📋 FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}:`, value);
      }

      // Verify user role is valid
      if (!['student', 'alumni', 'faculty', 'admin'].includes(user.role)) {
        throw new Error(`Invalid user role: ${user.role}`);
      }

      // Test server connectivity first
      try {
        console.log('🔍 Testing server connectivity...');
        const testResponse = await axios.get('/api/auth/check', { withCredentials: true });
        console.log('✅ Server test successful:', testResponse.data);
      } catch (testError) {
        console.error('❌ Server connectivity test failed:', testError);
        throw new Error('Server connection failed. Please ensure the backend is running.');
      }

      const response = await axios.patch(endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        timeout: 30000, // 30 second timeout
      });

      // Enhanced success checking
      const isSuccess = response.status === 200 && (
        response.data.success === true ||
        response.data.success === 'true' ||
        (response.data.message && response.data.message.includes('successfully'))
      );



      if (isSuccess) {
        const updatedUserData = {
          ...user,
          fullName: response.data.data.fullName,
          email: response.data.data.email,
          phoneNumber: response.data.data.phoneNumber,
          photoUrl: response.data.data.photoUrl,
          bio: response.data.data.bio,
          department: response.data.data.department,
          linkedinUrl: response.data.data.linkedinUrl,
          twitterUrl: response.data.data.twitterUrl,
          githubUrl: response.data.data.githubUrl,
        };
        setUser(updatedUserData);
        showAlert('Profile updated successfully!', 'success');
        redirectToDashboard();
      } else {

        showAlert(response.data.message || 'Failed to update profile.', 'error');
      }
    } catch (error) {
      console.error('🔍 Error message:', error.message);
      console.error('🔍 Error name:', error.name);
      console.error('🔍 Network error?', !error.response);

      let errorMessage = 'Failed to update profile. Please check your input.';

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.log('🚨 Server error detected:', error.response.status, error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
        console.log('🚨 Network error detected');
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred.';
        console.log('🚨 Unknown error detected:', error.message);
      }

      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!formData.profilePhoto || formData.profilePhoto instanceof File) {
      showAlert('No existing profile photo to delete.', 'info');
      return;
    }
    setConfirmMessage('Are you sure you want to delete your profile photo?');
    setConfirmAction(() => handleDeletePhoto);
    setConfirmOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-8"></div>
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-red-600 font-semibold">
          <p>Error: {error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm mt-4"
          >
            Go Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-6 px-2 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white p-4 sm:p-8 rounded-2xl shadow-2xl border border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition shadow"
            title="Back to Profile"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-indigo-800 tracking-tight">Edit Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:ring-4 group-hover:ring-indigo-200 transition">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto instanceof File ? URL.createObjectURL(formData.profilePhoto) : formData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 flex gap-1">
                <label
                  htmlFor="profilePhotoInput"
                  className="bg-indigo-600 text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors transform hover:scale-105 border-2 border-white"
                  title="Upload profile photo"
                >
                  <CameraIcon className="w-4 h-4" />
                  <input
                    type="file"
                    id="profilePhotoInput"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    name="profilePhoto"
                  />
                </label>
                {formData.profilePhoto && typeof formData.profilePhoto === 'string' && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={loading}
                    className="bg-gray-100 text-gray-700 p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 border-2 border-white"
                    title="Delete profile photo"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
                {formData.profilePhoto instanceof File && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: null }))}
                    className="bg-gray-100 text-gray-700 p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 border-2 border-white"
                    title="Clear selected photo"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              {formData.profilePhoto
                ? (formData.profilePhoto instanceof File ? 'New photo selected. Click save to upload.' : 'Click the camera icon to update or trash icon to remove your photo')
                : 'Click the camera icon to add a profile photo'}
            </p>
          </div>
          {/* Modern Basic Information Section */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Basic Information
              </h3>
              <p className="text-sm text-gray-600 mt-1">Your personal and contact details</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-gray-50 cursor-not-allowed"
                      placeholder="your.email@example.com"
                      required
                      readOnly
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">College Department</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 w-5 h-5 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    maxLength={400}
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400 select-none">
                    {formData.bio?.length || 0}/400
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Professional Information Section*/}
          {(formData.userRole === 'alumni') && (
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Professional Information
                </h3>
                <p className="text-sm text-gray-600 mt-1">Your educational background and experience</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Highest Qualification */}
                  <div>
                    <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="highestQualification"
                        name="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        maxLength={100}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g. B.Tech in Computer Science, MBA, PhD in Physics"
                      />
                    </div>
                  </div>

                  {/* Total Experience */}
                  <div>
                    <label htmlFor="totalExperience" className="block text-sm font-medium text-gray-700 mb-2">Total Experience (Years)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        id="totalExperience"
                        name="totalExperience"
                        value={formData.totalExperience}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modern Role-specific Section */}
          {formData.userRole && (
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {formData.userRole === 'student' ? 'Academic Information' :
                    formData.userRole === 'alumni' ? 'Professional Information' :
                      formData.userRole === 'faculty' ? 'Faculty Information' : 'Additional Information'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.userRole === 'student' ? 'Your academic details and current studies' :
                    formData.userRole === 'alumni' ? 'Your professional experience and career details' :
                      formData.userRole === 'faculty' ? 'Your faculty position and academic role' : 'Additional information about your profile'}
                </p>
              </div>

              <div className="p-6">
                <RoleSpecificProfileForm
                  role={formData.userRole}
                  formData={formData}
                  handleChange={handleChange}
                  setFormData={setFormData}
                />
              </div>
            </div>
          )}
          {/* Modern Social Media Section */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Social Media Links
              </h3>
              <p className="text-sm text-gray-600 mt-1">Connect your professional social media profiles</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                {/* Twitter */}
                <div>
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Modern Resume/CV and Skills Section - Only for Students and Alumni */}
          {(formData.userRole === 'student' || formData.userRole === 'alumni') && (
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Resume/CV & Skills
                </h3>
                <p className="text-sm text-gray-600 mt-1">Upload your resume and showcase your skills</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Modern CV Upload Section */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
                      {console.log('📄 Current resumeUrl:', resumeUrl)}

                      {/* Current CV Display */}
                      {resumeUrl ? (
                        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800">Current CV</p>
                              <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:text-green-800 underline">
                                View CV
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">No CV uploaded</p>
                              <p className="text-xs text-gray-500">Upload your resume to get started</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Modern File Upload */}
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
                          className={`block w-full p-3 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${cvUploading
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
                                  <span className="text-sm font-medium text-gray-700">Upload CV</span>
                                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Modern Skills Section */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>

                      {/* Skills Input */}
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const skill = newSkill.trim();
                                if (skill && !skills.includes(skill)) {
                                  setSkills([...skills, skill]);
                                  setNewSkill('');
                                }
                              }
                            }}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Type a skill and press Enter"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const skill = newSkill.trim();
                            if (skill && !skills.includes(skill)) {
                              setSkills([...skills, skill]);
                              setNewSkill('');
                            }
                          }}
                          disabled={!newSkill.trim() || skills.includes(newSkill.trim())}
                          className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {/* Skills Tags */}
                      <div className="min-h-[50px] p-3 bg-gray-50 rounded-xl border border-gray-200">
                        {console.log('🎨 Rendering skills:', skills)}
                        {skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-200"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleSkillRemove(skill)}
                                  className="ml-1 w-4 h-4 rounded-full hover:bg-blue-300 flex items-center justify-center transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 text-sm py-3">
                            <svg className="w-6 h-6 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p>No skills added yet</p>
                            <p className="text-xs text-gray-400 mt-1">Add your skills to showcase your expertise</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modern Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => {
                const dashboardRoute = user?.role ? `/${user.role}/dashboard` : '/';
                navigate(dashboardRoute);
              }}
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Profile Photo"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default ProfileEditor; 