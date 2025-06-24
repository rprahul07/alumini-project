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
} from '@heroicons/react/24/outline';

const ProfileEditor = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user, updateUser } = useAuth();
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
    currentSemester: '',
    rollNumber: '',
    graduationYear: '',
    currentJobTitle: '',
    companyName: '',
    course: '',
    designation: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!user) {
          showAlert('User data not found. Please log in again.', 'error');
          navigate('/auth');
          return;
        }
        const getEndpoint = `/api/${user.role}/profile/get/`;
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
          } else if (profileData.role === 'alumni' && profileData.alumni) {
            newFormData.graduationYear = profileData.alumni.graduationYear?.toString() || '';
            newFormData.currentJobTitle = profileData.alumni.currentJobTitle || '';
            newFormData.companyName = profileData.alumni.companyName || '';
            newFormData.course = profileData.alumni.course || '';
          } else if (profileData.role === 'faculty' && profileData.faculty) {
            newFormData.designation = profileData.faculty.designation || '';
          }
          setFormData(newFormData);
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
  }, [navigate, showAlert, user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User data not found');
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('linkedinUrl', formData.linkedinUrl || '');
      formDataToSend.append('twitterUrl', formData.twitterUrl || '');
      formDataToSend.append('githubUrl', formData.githubUrl || '');
      if (user.role === 'student') {
        if (formData.currentSemester) {
          formDataToSend.append('currentSemester', formData.currentSemester);
        }
        formDataToSend.append('rollNumber', formData.rollNumber || '');
        if (formData.graduationYear) {
          formDataToSend.append('graduationYear', formData.graduationYear);
        }
      } else if (user.role === 'alumni') {
        if (formData.graduationYear) {
          formDataToSend.append('graduationYear', formData.graduationYear);
        }
        formDataToSend.append('currentJobTitle', formData.currentJobTitle || '');
        formDataToSend.append('companyName', formData.companyName || '');
        formDataToSend.append('course', formData.course || '');
      } else if (user.role === 'faculty') {
        formDataToSend.append('designation', formData.designation || '');
      }
      if (formData.profilePhoto instanceof File) {
        formDataToSend.append('photo', formData.profilePhoto);
      }
      const response = await axios.patch(`/api/${user.role}/profile/update`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (response.data.success) {
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
        updateUser(updatedUserData);
        showAlert('Profile updated successfully!', 'success');
      } else {
        showAlert(response.data.message || 'Failed to update profile.', 'error');
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to update profile. Please check your input.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!formData.profilePhoto || formData.profilePhoto instanceof File) {
      showAlert('No existing profile photo to delete.', 'info');
      return;
    }
    if (!window.confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }
    try {
      setLoading(true);
      if (!user) throw new Error('User data not found');
      const deletePhotoEndpoint = `/api/${user.role}/profile/delete-photo`;
      const response = await axios.delete(deletePhotoEndpoint, { withCredentials: true });
      if (response.data.success) {
        setFormData((prev) => ({ ...prev, profilePhoto: null }));
        const updatedUserData = {
          ...user,
          photoUrl: null,
        };
        updateUser(updatedUserData);
        showAlert('Profile photo deleted successfully!', 'success');
      } else {
        showAlert(response.data.message || 'Error deleting profile photo', 'error');
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to delete profile photo', 'error');
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
              <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
              <div className="w-6" />
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
                    <UserIcon className="w-24 h-24 text-gray-300" />
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
                  {formData.profilePhoto && typeof formData.profilePhoto === 'string' && (
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
                  {formData.profilePhoto instanceof File && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: null }))}
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
                  ? (formData.profilePhoto instanceof File ? 'New photo selected. Click save to upload.' : 'Click the camera icon to update or trash icon to remove your photo')
                  : 'Click the camera icon to add a profile photo'}
              </p>
            </div>
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
                      readOnly
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
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself and your interests..."
                  />
                </div>
              </div>
            </div>
            {formData.userRole && (
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
            )}
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