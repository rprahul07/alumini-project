import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiCalendar, FiBook, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState('login');
  const [userRole, setUserRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    department: '',
    // Student specific fields
    currentSemester: '',
    rollNumber: '',
    // Alumni specific fields
    currentJobTitle: '',
    companyName: '',
    graduationYear: '',
    // Faculty specific fields
    designation: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle current semester as integer
    if (name === 'currentSemester') {
      const semesterValue = parseInt(value);
      if (isNaN(semesterValue) || semesterValue < 1 || semesterValue > 8) {
        setError('Current semester must be a number between 1 and 8');
        return;
      }
      setFormData(prev => ({
        ...prev,
        [name]: semesterValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setUserRole(newRole);
    // Reset role-specific fields when role changes
    setFormData(prev => ({
      ...prev,
      currentSemester: '',
      rollNumber: '',
      currentJobTitle: '',
      companyName: '',
      graduationYear: '',
      designation: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
try {
      const endpoint = authType === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const submitData = authType === 'login' ? {
        email: formData.email,
        password: formData.password,
        role: userRole
      } : {
        ...formData,
        role: userRole,
        // Ensure currentSemester is sent as a number for student registration
        currentSemester: userRole === 'student' ? parseInt(formData.currentSemester) : undefined,
        // Ensure all required fields are included
        department: formData.department || '',
        rollNumber: formData.rollNumber || '',
        // Remove undefined fields
        ...(userRole !== 'student' && { currentSemester: undefined }),
        ...(userRole !== 'alumni' && {
          graduationYear: undefined,
          currentJobTitle: undefined,
          companyName: undefined
        }),
        ...(userRole !== 'faculty' && { designation: undefined })
      };

      console.log('Submitting data:', submitData);

      const response = await axios.post(endpoint, submitData, {
        withCredentials: true // Important for handling cookies
      });
      console.log('Server response:', response.data);

      const userObj = response.data.data || response.data.user;
      if (response.data.success && userObj) {
        toast.success(response.data.message || (authType === 'login' ? 'Login successful!' : 'Registration successful!'));

        if (authType === 'register') {
          console.log('Signup successful, redirecting to login page.');
          console.log('Signup response:', response);
          navigate('/login', { replace: true });
        } else {
          // If it's a login, store user data and redirect to dashboard
          const userData = {
            id: userObj._id || userObj.id,
            fullName: userObj.fullName,
            email: userObj.email,
            role: userObj.role
          };
          console.log('Storing user data:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          // Store token and role in localStorage
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          localStorage.setItem('role', userObj.role.toLowerCase());

          // Redirect based on role after successful login
          const role = userObj.role.toLowerCase();
          console.log('Login successful, redirecting to dashboard for role:', role);
          
          // Redirect to the appropriate dashboard
          if (role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate(`/dashboard/${role}`, { replace: true });
          }
        }
      } else {
        throw new Error(response.data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.message || err.message || 'Authentication failed');
      toast.error(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  const renderRoleSpecificFields = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <div>
              <label htmlFor="currentSemester" className="block text-sm font-medium text-gray-700">
                Current Semester
              </label>
              <div className="mt-1 relative">
                <input
                  id="currentSemester"
                  name="currentSemester"
                  type="number"
                  min="1"
                  max="8"
                  required
                  value={formData.currentSemester}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your current semester (1-8)"
                />
                <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">Enter a number between 1 and 8</p>
            </div>
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <div className="mt-1 relative">
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your roll number"
                />
                <FiUser className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </>
        );
      case 'alumni':
        return (
          <>
            <div>
              <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                Graduation Year
              </label>
              <div className="mt-1 relative">
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="text"
                  required
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your graduation year"
                />
                <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="currentJobTitle" className="block text-sm font-medium text-gray-700">
                Current Job Title
              </label>
              <div className="mt-1 relative">
                <input
                  id="currentJobTitle"
                  name="currentJobTitle"
                  type="text"
                  required
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your current job title"
                />
                <FiBriefcase className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your company name"
                />
                <FiAward className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </>
        );
      case 'faculty':
        return (
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <div className="mt-1 relative">
              <input
                id="designation"
                name="designation"
                type="text"
                required
                value={formData.designation}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your designation"
              />
              <FiAward className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {authType === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {authType === 'login' 
              ? 'Sign in to access your account' 
              : 'Join our community and connect with others'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Auth Type Toggle */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setAuthType('login')}
              className={`px-4 py-2 rounded-md transition-colors ${
                authType === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthType('register')}
              className={`px-4 py-2 rounded-md transition-colors ${
                authType === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              value={userRole}
              onChange={handleRoleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {authType === 'register' && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                    <FiUser className="absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                    <FiPhone className="absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="department"
                      name="department"
                      type="text"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your department"
                    />
                    <FiBook className="absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                {/* Role-specific fields */}
                {renderRoleSpecificFields()}
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                />
                <FiMail className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {authType === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                  <FiLock className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Processing...
                  </div>
                ) : (
                  authType === 'login' ? 'Sign in' : 'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
