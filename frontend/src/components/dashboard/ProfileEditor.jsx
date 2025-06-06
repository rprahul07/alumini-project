// ✅ Cleaned & Optimized - Placeholder-safe
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../middleware/api';
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

const ProfileEditor = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null,
    userRole: user?.role || '',
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
    const fetchProfile = async () => {
      try {
        const { data } = await profileAPI.getProfile();
        if (data) {
          setFormData(prev => ({
            ...prev,
            fullName: data.fullName || prev.fullName,
            email: data.email || prev.email,
            phoneNumber: data.phoneNumber || prev.phoneNumber,
            profilePhoto: data.profilePhoto || prev.profilePhoto,
            userRole: data.role || prev.userRole,
            bio: data.bio || prev.bio,
            ...(data.role === 'student' && {
              collegeRollNumber: data.rollNumber || prev.collegeRollNumber,
              batch: data.batch || prev.batch,
              department: data.department || prev.department,
              linkedInProfile: data.linkedInProfile || prev.linkedInProfile
            }),
            ...(data.role === 'alumni' && {
              graduationYear: data.graduationYear || prev.graduationYear,
              department: data.department || prev.department,
              currentJobTitle: data.currentJobTitle || prev.currentJobTitle,
              currentCompany: data.companyName || prev.currentCompany,
              previousRoles: data.previousRoles || prev.previousRoles,
              previousCompanies: data.previousCompanies || prev.previousCompanies,
              linkedInProfile: data.linkedInProfile || prev.linkedInProfile
            }),
            ...(data.role === 'faculty' && {
              department: data.department || prev.department,
              designation: data.designation || prev.designation
            })
          }));
        }
      } catch {
        showAlert('Error fetching profile data', 'error');
      }
    };
    fetchProfile();
  }, [showAlert, user]);

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
      let profilePhotoUrl = formData.profilePhoto;
      if (formData.profilePhoto instanceof File) {
        const fd = new FormData();
        fd.append('profilePhoto', formData.profilePhoto);
        const { data } = await profileAPI.uploadProfilePhoto(fd);
        profilePhotoUrl = data.profilePhotoUrl;
      }

      // Transform data to match backend expectations
      const updateData = {
        ...formData,
        profilePhoto: profilePhotoUrl,
        // Map frontend field names to backend field names
        ...(formData.userRole === 'student' && {
          rollNumber: formData.collegeRollNumber
        }),
        ...(formData.userRole === 'alumni' && {
          companyName: formData.currentCompany
        })
      };

      const { data } = await profileAPI.updateProfile(updateData);
      if (data) {
        showAlert('Profile updated successfully!', 'success');
        updateUser(data);
        navigate('/dashboard');
      }
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
      const { data } = await profileAPI.deleteProfilePhoto();
      if (data) {
        setFormData(prev => ({ ...prev, profilePhoto: null }));
        updateUser({ ...user, profilePhoto: null });
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
                    src={formData.profilePhoto instanceof File 
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
                    />
                  </label>
                  {formData.profilePhoto && (
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
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <PencilIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
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
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;

