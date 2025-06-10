import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  TrashIcon
} from '@heroicons/react/24/outline';
import { FiUpload, FiX } from 'react-icons/fi';

const ProfileEditor = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null,
    userRole: '',
    bio: '',
    collegeRollNumber: '',
    batch: { startYear: '', endYear: '' },
    department: '',
    linkedInProfile: '',
    graduationYear: '',
    currentJobTitle: '',
    currentCompany: '',
    previousRoles: [],
    previousCompanies: [],
    designation: '',
    address: '',
    currentSemester: '',
    linkedinUrl: '',
    twitterUrl: '',
    githubUrl: '',
    profilePicture: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/student/profile/get/', {
          withCredentials: true
        });
        console.log('Profile data:', response.data);
        if (response.data.success) {
          const profileData = response.data.data;
          setFormData({
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            profilePhoto: profileData.profilePicture || null,
            userRole: profileData.role || '',
            bio: profileData.bio || '',
            department: profileData.department || '',
            address: profileData.address || '',
            currentSemester: profileData.currentSemester || '',
            linkedinUrl: profileData.linkedinUrl || '',
            twitterUrl: profileData.twitterUrl || '',
            githubUrl: profileData.githubUrl || '',
            ...(profileData.role === 'student' && {
              collegeRollNumber: profileData.rollNumber || '',
              batch: profileData.batch || { startYear: '', endYear: '' },
              linkedInProfile: profileData.linkedInProfile || ''
            }),
            ...(profileData.role === 'alumni' && {
              graduationYear: profileData.graduationYear || '',
              currentJobTitle: profileData.currentJobTitle || '',
              currentCompany: profileData.currentCompany || '',
              previousRoles: profileData.previousRoles || [],
              previousCompanies: profileData.previousCompanies || [],
              linkedInProfile: profileData.linkedInProfile || ''
            }),
            ...(profileData.role === 'faculty' && {
              designation: profileData.designation || ''
            }),
            profilePicture: null
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
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
    } else if (name.includes('.')) {
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
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put('/api/student/profile/update/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (response.data.success) {
        showAlert('Profile updated successfully!', 'success');
        navigate('/profile');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleDeletePhoto = async () => {
    if (!formData.profilePhoto) return;
    try {
      setLoading(true);
      const response = await axios.delete('/api/student/profile/delete-photo', {
        withCredentials: true
      });
      if (response.data.success) {
        setFormData(prev => ({ ...prev, profilePhoto: null }));
        showAlert('Profile photo deleted successfully!', 'success');
      }
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Error deleting profile photo',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
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
                className="text-white hover:text-indigo-100 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
              <div className="w-6" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={
                      formData.profilePhoto instanceof File
                        ? URL.createObjectURL(formData.profilePhoto)
                        : formData.profilePhoto || '/default-avatar.png'
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2">
                  <label className="bg-indigo-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                    <CameraIcon className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      name="profilePhoto"
                    />
                  </label>
                  {formData.profilePhoto && !(formData.profilePhoto instanceof File) && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      disabled={loading}
                      className="bg-red-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-6 h-6" />
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
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
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
                    value={formData.bio}
                    onChange={handleChange}
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Role-specific fields */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {formData.userRole === 'student' ? 'Academic Information' :
                  formData.userRole === 'alumni' ? 'Professional Information' :
                  formData.userRole === 'faculty' ? 'Faculty Information' : 'Additional Information'}
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <RoleSpecificProfileForm
                  role={formData.userRole}
                  formData={formData}
                  handleChange={handleChange}
                  setFormData={setFormData}
                />
              </div>
            </div>

            {/* LinkedIn, Twitter, GitHub URLs */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="url"
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <div className="relative">
                    <PencilIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
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
