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
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm mt-4"
          >
            Go Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10 px-2 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-indigo-100">
        <div className="flex items-center gap-2 mb-6">
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:ring-4 group-hover:ring-indigo-200 transition">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto instanceof File ? URL.createObjectURL(formData.profilePhoto) : formData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 flex gap-2">
                <label
                  htmlFor="profilePhotoInput"
                  className="bg-indigo-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors transform hover:scale-105 border-2 border-white"
                  title="Upload profile photo"
                >
                  <CameraIcon className="w-5 h-5" />
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
                    className="bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 border-2 border-white"
                    title="Delete profile photo"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
                {formData.profilePhoto instanceof File && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: null }))}
                    className="bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 border-2 border-white"
                    title="Clear selected photo"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">
              {formData.profilePhoto
                ? (formData.profilePhoto instanceof File ? 'New photo selected. Click save to upload.' : 'Click the camera icon to update or trash icon to remove your photo')
                : 'Click the camera icon to add a profile photo'}
            </p>
          </div>
          {/* Basic Information */}
          <div className="mb-8 p-6 bg-indigo-50 rounded-xl shadow-inner border-l-4 border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Basic Information</h3>
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
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
                    required
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
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm bg-gray-100 cursor-not-allowed"
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
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
                    placeholder="e.g., +91 9876543210"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">College Department</label>
                <div className="relative">
                  <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
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
                  maxLength={400}
                  value={formData.bio || ''}
                  onChange={handleChange}
                  className="pl-10 pr-12 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm bg-indigo-50/50 resize-none transition placeholder-gray-400 hover:border-indigo-300 scrollbar-hide"
                  placeholder="Tell us about yourself and your interests... (max 400 characters)"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                />
                {/* Hide scrollbar for Webkit browsers */}
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                <span className="absolute bottom-2 right-4 text-xs text-gray-400 select-none">
                  {formData.bio?.length || 0}/400
                </span>
              </div>
            </div>
          </div>
          {/* Role-specific Section */}
          {formData.userRole && (
            <div className="mb-8 p-6 bg-indigo-50 rounded-xl shadow-inner border-l-4 border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">
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
          {/* Social Media Section */}
          <div className="mb-8 p-6 bg-indigo-50 rounded-xl shadow-inner border-l-4 border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Social Media Links</h3>
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
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
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
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
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
                    className="pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
                    placeholder="e.g., https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="rounded-full px-4 py-1.5 font-semibold bg-white text-indigo-600 border border-indigo-200 shadow hover:bg-indigo-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor; 