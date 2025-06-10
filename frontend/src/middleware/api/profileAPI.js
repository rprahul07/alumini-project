import axios from 'axios';
import { useEffect } from 'react';

const BASE_URL = '/api/student/profile';

export const profileAPI = {
  getProfile: (userId) => axios.get(`/api/student/profile?userId=${userId}`),
  updateProfile: (userId, data) => axios.patch(`${BASE_URL}?userId=${userId}`, data),
  deleteProfile: (userId) => axios.delete(`${BASE_URL}?userId=${userId}`),
  // ...other methods
};

export const useProfile = (user, setFormData, showAlert) => {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileAPI.getProfile(user.id); // user.id is passed here
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
  }, [showAlert, user, setFormData]);
};