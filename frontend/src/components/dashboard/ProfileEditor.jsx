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
const baseApi = 'http://localhost:5000';
const ProfileEditor = ({ userId, userRole }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null,
    userRole: userRole || '',
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
    designation: ''
  });

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/api/student/profile/get`);
        if (data) {
          setFormData(prev => ({
            ...prev,
            fullName: data.fullName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            profilePhoto: data.photoUrl || null,
            userRole: data.role || userRole,
            bio: data.bio || '',
            ...(data.role === 'student' && {
              collegeRollNumber: data.student?.rollNumber || '',
              department: data.department || '',
              batch: data.student?.batch || { startYear: '', endYear: '' },
              linkedInProfile: data.linkedInProfile || ''
            }),
            ...(data.role === 'alumni' && {
              graduationYear: data.graduationYear || '',
              department: data.department || '',
              currentJobTitle: data.currentJobTitle || '',
              currentCompany: data.currentCompany || '',
              previousRoles: data.previousRoles || [],
              previousCompanies: data.previousCompanies || [],
              linkedInProfile: data.linkedInProfile || ''
            }),
            ...(data.role === 'faculty' && {
              department: data.department || '',
              designation: data.designation || ''
            }),
          }));
        }
      } catch (err) {
        showAlert('Error fetching profile data', 'error');
      }
    };

    fetchProfile();
  }, [userId, userRole, showAlert]);

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
    setLoading(true);

    try {
      let profilePhotoUrl = formData.profilePhoto ;

      if (formData.profilePhoto instanceof File) {
        const fd = new FormData();
        fd.append('profilePhoto', formData.profilePhoto);
        const uploadRes = await axios.post(`${baseApi}/profile/${userId}/upload-photo`, fd);
        profilePhotoUrl = uploadRes.data.profilePhotoUrl;
      }

      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        photoUrl: profilePhotoUrl,
        role: formData.userRole,
        bio: formData.bio,
        department: formData.department,
        linkedInProfile: formData.linkedInProfile,
        ...(formData.userRole === 'student' && {
          student: {
            rollNumber: formData.collegeRollNumber,
            batch: formData.batch
          }
        }),
        ...(formData.userRole === 'alumni' && {
          graduationYear: formData.graduationYear,
          currentJobTitle: formData.currentJobTitle,
          currentCompany: formData.currentCompany,
          previousRoles: formData.previousRoles,
          previousCompanies: formData.previousCompanies
        }),
        ...(formData.userRole === 'faculty' && {
          designation: formData.designation
        }),
      };

      const { data } = await axios.put(`${baseApi}/api/profile/${userId}`, updateData);
      showAlert('Profile updated successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Error updating profile',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!formData.profilePhoto) return;
    try {
      setLoading(true);
      const { data } = await axios.delete(`${baseApi}/api/profile/${userId}/delete-photo`);
      if (data) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/dashboard')}
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
