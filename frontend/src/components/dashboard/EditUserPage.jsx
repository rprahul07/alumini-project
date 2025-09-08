import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../middleware/api';
import { toast } from 'react-hot-toast';

const userTypeToApi = {
  students: 'student',
  alumni: 'alumni',
  faculty: 'faculty',
};

const EditUserPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('EditUserPage: Fetching user data for:', { type, id });
      setLoading(true);
      setError(null);
      try {
        const apiType = userTypeToApi[type];
        if (!apiType) throw new Error('Invalid user type');
        
        console.log('EditUserPage: Making GET request to:', `/api/${apiType}/${id}`);
        const res = await apiService.raw.get(`/api/${apiType}/${id}`);
        console.log('EditUserPage: Fetch response:', res);
        
        const userData = res.data.data || res.data;
        console.log('EditUserPage: Raw API response:', res.data);
        console.log('EditUserPage: Setting user data:', userData);
        console.log('EditUserPage: User data structure:', JSON.stringify(userData, null, 2));
        
        // Ensure nested objects exist to prevent rendering issues
        const processedUserData = {
          ...userData,
          student: userData.student || {},
          alumni: userData.alumni || {},
          faculty: userData.faculty || {}
        };
        
        // If the data is already flattened (some APIs return flat data), restructure it
        // Only handle fields that are supported by the backend
        if (userData.graduationYear && !userData.student?.graduationYear) {
          processedUserData.student = {
            ...processedUserData.student,
            graduationYear: userData.graduationYear
          };
        }
        if (userData.currentSemester && !userData.student?.currentSemester) {
          processedUserData.student = {
            ...processedUserData.student,
            currentSemester: userData.currentSemester
          };
        }
        if (userData.rollNumber && !userData.student?.rollNumber) {
          processedUserData.student = {
            ...processedUserData.student,
            rollNumber: userData.rollNumber
          };
        }
        
        // Handle alumni fields (check alumni controller for supported fields)
        if (userData.batch_startYear && !userData.alumni?.batch_startYear) {
          processedUserData.alumni = {
            ...processedUserData.alumni,
            batch_startYear: userData.batch_startYear
          };
        }
        if (userData.batch_endYear && !userData.alumni?.batch_endYear) {
          processedUserData.alumni = {
            ...processedUserData.alumni,
            batch_endYear: userData.batch_endYear
          };
        }
        if (userData.currentJobTitle && !userData.alumni?.currentJobTitle) {
          processedUserData.alumni = {
            ...processedUserData.alumni,
            currentJobTitle: userData.currentJobTitle
          };
        }
        if (userData.companyName && !userData.alumni?.companyName) {
          processedUserData.alumni = {
            ...processedUserData.alumni,
            companyName: userData.companyName
          };
        }
        
        // Handle faculty fields (check faculty controller for supported fields)
        if (userData.position && !userData.faculty?.position) {
          processedUserData.faculty = {
            ...processedUserData.faculty,
            position: userData.position
          };
        }
        if (userData.designation && !userData.faculty?.designation) {
          processedUserData.faculty = {
            ...processedUserData.faculty,
            designation: userData.designation
          };
        }
        if (userData.highestQualification && !userData.faculty?.highestQualification) {
          processedUserData.faculty = {
            ...processedUserData.faculty,
            highestQualification: userData.highestQualification
          };
        }
        if (userData.totalExperience && !userData.faculty?.totalExperience) {
          processedUserData.faculty = {
            ...processedUserData.faculty,
            totalExperience: userData.totalExperience
          };
        }
        
        console.log('EditUserPage: Processed user data:', processedUserData);
        setUserData(processedUserData);
      } catch (err) {
        console.error('EditUserPage: Fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [type, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('EditUserPage: Field changed:', { name, value });
    
    // Handle nested fields (e.g., student.currentSemester)
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setUserData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('EditUserPage: Submitting form with data:', userData);
    setSaving(true);
    setError(null);
    try {
      const apiType = userTypeToApi[type];
      if (!apiType) throw new Error('Invalid user type');
      
      // Prepare data for backend - extract all fields to top level
      const updateData = {
        // User-level fields
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        department: userData.department,
        bio: userData.bio,
        linkedinUrl: userData.linkedinUrl,
        twitterUrl: userData.twitterUrl,
        githubUrl: userData.githubUrl,
      };
      
      // Add role-specific fields based on type - only send fields that backend supports
      if (type === 'students' && userData.student) {
        updateData.currentSemester = userData.student.currentSemester;
        updateData.rollNumber = userData.student.rollNumber;
        updateData.graduationYear = userData.student.graduationYear;
        // Note: batch_startYear and batch_endYear are not supported by backend for students
      } else if (type === 'alumni' && userData.alumni) {
        // Check alumni controller for supported fields
        updateData.graduationYear = userData.alumni.graduationYear;
        updateData.batch_startYear = userData.alumni.batch_startYear;
        updateData.batch_endYear = userData.alumni.batch_endYear;
        updateData.currentJobTitle = userData.alumni.currentJobTitle;
        updateData.companyName = userData.alumni.companyName;
        updateData.company_role = userData.alumni.company_role;
        updateData.course = userData.alumni.course;
      } else if (type === 'faculty' && userData.faculty) {
        // Check faculty controller for supported fields
        updateData.position = userData.faculty.position;
        updateData.designation = userData.faculty.designation;
        updateData.highestQualification = userData.faculty.highestQualification;
        updateData.totalExperience = userData.faculty.totalExperience;
      }
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
          delete updateData[key];
        }
      });
      
      console.log('EditUserPage: Prepared data for backend:', updateData);
      console.log('EditUserPage: Making PATCH request to:', `/api/${apiType}/${id}`);
      const response = await apiService.raw.patch(`/api/${apiType}/${id}`, updateData);
      console.log('EditUserPage: Update response:', response);
      
      toast.success('User updated successfully!');
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 1500);
    } catch (err) {
      console.error('EditUserPage: Update error:', err);
      console.error('EditUserPage: Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading user data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!userData) return null;

  console.log('EditUserPage: Rendering form with userData:', userData);
  console.log('EditUserPage: Student data:', userData.student);
  console.log('EditUserPage: Alumni data:', userData.alumni);
  console.log('EditUserPage: Faculty data:', userData.faculty);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6">Edit {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(userData).map(([key, value]) => {
          // Skip certain fields
          if (key === 'id' || key === 'userId' || key === 'createdAt' || key === 'user' || key === 'updatedAt') {
            return null;
          }
          
          // Handle nested objects (like student, alumni, faculty)
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            console.log(`EditUserPage: Rendering nested object for key: ${key}`, value);
            return Object.entries(value).map(([nestedKey, nestedValue]) => {
              // Skip certain fields that shouldn't be edited
              if (nestedKey === 'id' || nestedKey === 'userId' || nestedKey === 'createdAt' || nestedKey === 'updatedAt') {
                return null;
              }
              
              // Skip fields that are not supported by the backend
              if (type === 'students' && (nestedKey === 'batch_startYear' || nestedKey === 'batch_endYear')) {
                console.log(`EditUserPage: Skipping unsupported field for students: ${nestedKey}`);
                return null;
              }
              
              console.log(`EditUserPage: Rendering nested field: ${key}.${nestedKey} = ${nestedValue}`);
              
              return (
                <div key={`${key}.${nestedKey}`}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {nestedKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  </label>
                  <input
                    type="text"
                    name={`${key}.${nestedKey}`}
                    value={nestedValue !== null && nestedValue !== undefined ? nestedValue : ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={`Enter ${nestedKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase()}`}
                  />
                </div>
              );
            });
          }
          
          // Handle regular fields
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
              </label>
              <input
                type="text"
                name={key}
                value={value !== null && value !== undefined ? value : ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase()}`}
              />
            </div>
          );
        })}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage; 