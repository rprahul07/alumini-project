import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import useAlert from '../../hooks/useAlert';
import RoleSpecificProfileForm from './RoleSpecificProfileForm';
import {
  CameraIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
// FiUpload and FiX are not used in the current render logic, but kept if you plan to use them
// import { FiUpload, FiX } from 'react-icons/fi';

const ProfileEditor = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null, // This will hold either a File object or a photo URL string
    userRole: '', // This will be set from the fetched user data
    bio: '',
    department: '',
    linkedinUrl: '',
    twitterUrl: '',
    githubUrl: '',
    // Student specific fields
    currentSemester: '',
    rollNumber: '',
    graduationYear: '', // Shared between student and alumni
    batch: {
      startYear: '',
      endYear: ''
    },
    // Alumni specific fields
    currentJobTitle: '',
    companyName: '',
    // Faculty specific fields
    designation: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          console.error('User data not found in localStorage');
          throw new Error('User data not found');
        }

        const parsedUser = JSON.parse(userData);
        console.log('Fetching profile for user role:', parsedUser.role);
        // Construct the GET endpoint dynamically based on user role
        const getEndpoint = `/api/${parsedUser.role}/profile/get/`;
        console.log('GET request URL:', getEndpoint);

        const response = await axios.get(getEndpoint, {
          withCredentials: true
        });

        console.log('Raw profile fetch response:', response);

        if (response.data.success) {
          const profileData = response.data.data;
          console.log('Profile data received:', profileData);

          const newFormData = {
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            profilePhoto: profileData.photoUrl || null, // Set the URL here
            userRole: profileData.role || '',
            bio: profileData.bio || '',
            department: profileData.department || '',
            linkedinUrl: profileData.linkedinUrl || '',
            twitterUrl: profileData.twitterUrl || '',
            githubUrl: profileData.githubUrl || '',
            // Role specific fields
            ...(profileData.role === 'student' && {
              currentSemester: profileData.student?.currentSemester || '',
              rollNumber: profileData.student?.rollNumber || '',
              graduationYear: profileData.student?.graduationYear || '',
              batch: {
                startYear: profileData.student?.batch?.startYear || '',
                endYear: profileData.student?.batch?.endYear || ''
              }
            }),
            ...(profileData.role === 'alumni' && {
              graduationYear: profileData.alumni?.graduationYear || '',
              currentJobTitle: profileData.alumni?.currentJobTitle || '',
              companyName: profileData.alumni?.companyName || ''
            }),
            ...(profileData.role === 'faculty' && {
              designation: profileData.faculty?.designation || ''
            }),
          };

          console.log('Setting form data with:', newFormData);
          setFormData(newFormData);
        } else {
          console.error('Profile fetch failed:', response.data.message || 'Unknown error');
          setError(response.data.message || 'Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.message || 'Failed to load profile data. Please check your network or server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
    } else if (name.includes('.')) { // Handles nested objects like batch.startYear
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User data not found in localStorage');
      }

      const parsedUser = JSON.parse(userData);
      const formDataToSend = new FormData();

      // Add only the fields that the backend expects
      const fieldsToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        bio: formData.bio || null,
        linkedinUrl: formData.linkedinUrl || null,
        currentSemester: formData.currentSemester,
        rollNumber: formData.rollNumber,
        graduationYear: formData.graduationYear || null
      };

      // Append each field to FormData
      Object.entries(fieldsToSend).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // Add profile photo if it's a File object
      if (formData.profilePhoto instanceof File) {
        formDataToSend.append('photo', formData.profilePhoto);
      }

      // Log the form data being sent
      console.log('Form data before sending:', formData);
      console.log('FormData entries being sent:', Object.fromEntries(formDataToSend));

      const response = await axios.patch(`/api/student/profile/update`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      console.log('Update response:', response.data);

      if (response.data.success) {
        // Update local storage with new user data
        const updatedUserData = {
          ...parsedUser,
          ...response.data.data
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        // Show success message
        showAlert('Profile updated successfully!', 'success');
        
        // Navigate back to profile view
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert(error.response?.data?.message || 'Failed to update profile. Please check your input.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    // Only attempt to delete if there's an existing photo URL (not a newly selected File)
    if (!formData.profilePhoto || formData.profilePhoto instanceof File) {
      showAlert('No profile photo to delete or photo is unsaved.', 'info');
      return;
    }

    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User data not found');
      }

      const parsedUser = JSON.parse(userData);
      const deletePhotoEndpoint = `/api/${parsedUser.role}/profile/delete-photo`;
      console.log('DELETE photo URL:', deletePhotoEndpoint);

      const response = await axios.delete(deletePhotoEndpoint, {
        withCredentials: true
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, profilePhoto: null })); // Clear photo from state
        showAlert('Profile photo deleted successfully!', 'success');
        // Optionally update local storage if the backend response includes updated user data
        // For simplicity, you might need another fetch or just rely on the next profile load
        // if photoUrl is part of the main user object in local storage.
      } else {
        showAlert(response.data.message || 'Error deleting profile photo', 'error');
      }
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      showAlert(
        error.response?.data?.message || 'Failed to delete profile photo',
        'error'
      );
    } finally {
      setLoading(false);
    }
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

  // If there's an error after loading, display it
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-red-600 font-semibold">
          <p>Error: {error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/profile')}
                className="text-white hover:text-indigo-100 transition-colors p-2 rounded-full hover:bg-indigo-700/30"
                title="Go back"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
              <div className="w-6" /> {/* Spacer for symmetry */}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center text-gray-400">
                  {formData.profilePhoto ? (
                    <img
                      src={
                        formData.profilePhoto instanceof File
                          ? URL.createObjectURL(formData.profilePhoto)
                          : formData.profilePhoto
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-24 h-24 text-gray-300" /> // Placeholder icon
                  )}
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2">
                  <label
                    htmlFor="profilePhotoInput"
                    className="bg-indigo-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors transform hover:scale-105"
                    title="Upload profile photo"
                  >
                    <CameraIcon className="w-6 h-6" />
                    <input
                      type="file"
                      id="profilePhotoInput"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      name="profilePhoto"
                    />
                  </label>
                  {/* Show delete button only if there's an existing photo URL (not a new File) */}
                  {formData.profilePhoto && !(formData.profilePhoto instanceof File) && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      disabled={loading}
                      className="bg-red-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-50 transform hover:scale-105"
                      title="Delete profile photo"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  )}
                  {/* Optionally show a clear button for a newly selected file before upload */}
                  {formData.profilePhoto instanceof File && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, profilePhoto: null }))}
                      className="bg-gray-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-600 transition-colors transform hover:scale-105"
                      title="Clear selected photo"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {formData.profilePhoto
                  ? 'Click the camera icon to update or trash icon to remove your photo'
                  : 'Click the camera icon to add a profile photo'}
              </p>
            </div>

            {/* Basic Info */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 border-gray-200">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                      required
                      readOnly // Email is usually not editable
                      placeholder="Your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., +91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <div className="relative">
                  <PencilIcon className="absolute top-3 left-3 h-5 w-5 text-indigo-500" />
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio || ''} // Ensure it's not null for textarea
                    onChange={handleChange}
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself and your interests..."
                  />
                </div>
              </div>
            </div>

            {/* Role-specific fields */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 border-gray-200">
                {formData.userRole === 'student' ? 'Academic Information' :
                  formData.userRole === 'alumni' ? 'Professional Information' :
                    formData.userRole === 'faculty' ? 'Faculty Information' : 'Additional Information'}
              </h3>
              <div className="bg-white rounded-lg p-6 border border-gray-100">
                <RoleSpecificProfileForm
                  role={formData.userRole}
                  formData={formData}
                  handleChange={handleChange}
                  setFormData={setFormData}
                />
              </div>
            </div>

            {/* LinkedIn, Twitter, GitHub URLs */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 border-gray-200">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl || ''}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="url"
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl || ''}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., https://twitter.com/yourhandle"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl || ''}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., https://github.com/yourusername"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;