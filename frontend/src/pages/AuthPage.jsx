import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiCalendar, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const roleLabels = {
  student: 'Student',
  alumni: 'Alumni',
  faculty: 'Faculty',
  admin: 'Admin',
};

const roleColors = {
  student: 'bg-blue-50 text-blue-700',
  alumni: 'bg-green-50 text-green-700',
  faculty: 'bg-purple-50 text-purple-700',
  admin: 'bg-red-50 text-red-700',
};

const iconMap = {
  fullName: <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  email: <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  phoneNumber: <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  password: <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  confirmPassword: <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  currentSemester: <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  rollNumber: <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  graduationYear: <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  currentJobTitle: <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  companyName: <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  designation: <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  department: <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, selectedRole, login, register, loading, error, clearError } = useAuth();
  const [authType, setAuthType] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    department: '',
    currentSemester: '',
    rollNumber: '',
    currentJobTitle: '',
    companyName: '',
    graduationYear: '',
    designation: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user && user.role) {
      if (user.role === 'student') navigate('/student/dashboard', { replace: true });
      else if (user.role === 'alumni') navigate('/alumni/dashboard', { replace: true });
      else if (user.role === 'faculty') navigate('/faculty/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!selectedRole) {
      navigate('/role-selection', { replace: true });
    }
  }, [selectedRole, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();
    try {
      if (authType === 'login') {
        const result = await login({
          email: formData.email,
          password: formData.password,
          role: selectedRole
        });
        if (result.success) {
          toast.success('Login successful!');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setFormError('Passwords do not match');
          return;
        }
        const regData = {
          ...formData,
          role: selectedRole,
          currentSemester: selectedRole === 'student' ? parseInt(formData.currentSemester) : undefined,
          department: formData.department || '',
          rollNumber: formData.rollNumber || '',
          ...(selectedRole !== 'student' && { currentSemester: undefined }),
          ...(selectedRole !== 'alumni' && {
            graduationYear: undefined,
            currentJobTitle: undefined,
            companyName: undefined
          }),
          ...(selectedRole !== 'faculty' && { designation: undefined })
        };
        const result = await register(regData);
        if (result.success) {
          toast.success('Registration successful! Please login.');
          setAuthType('login');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed');
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <>
            <div className="form-group relative">
              <label className="label" htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="input pl-10 text-sm rounded-md w-full py-2 px-3 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Department"
              />
              {iconMap.department}
            </div>
            <div className="form-group relative">
              <label className="label" htmlFor="currentSemester">Current Semester</label>
              <input
                id="currentSemester"
                name="currentSemester"
                type="number"
                min="1"
                max="8"
                required
                value={formData.currentSemester}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Current Semester"
              />
              {iconMap.currentSemester}
            </div>
            <div className="form-group relative">
              <label className="label" htmlFor="rollNumber">Roll Number</label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                required
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Roll Number"
              />
              {iconMap.rollNumber}
            </div>
          </>
        );
      case 'alumni':
        return (
          <>
            <div className="form-group relative">
              <label className="label" htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="input pl-10 text-sm rounded-md w-full py-2 px-3 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Department"
              />
              {iconMap.department}
            </div>
            <div className="form-group relative">
              <label className="label" htmlFor="graduationYear">Graduation Year</label>
              <input
                id="graduationYear"
                name="graduationYear"
                type="text"
                required
                value={formData.graduationYear}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Graduation Year"
              />
              {iconMap.graduationYear}
            </div>
            <div className="form-group relative">
              <label className="label" htmlFor="currentJobTitle">Current Job Title</label>
              <input
                id="currentJobTitle"
                name="currentJobTitle"
                type="text"
                required
                value={formData.currentJobTitle}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Current Job Title"
              />
              {iconMap.currentJobTitle}
            </div>
            <div className="form-group relative">
              <label className="label" htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Company Name"
              />
              {iconMap.companyName}
            </div>
          </>
        );
      case 'faculty':
        return (
          <>
            <div className="form-group relative">
              <label className="label" htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="input pl-10 text-sm rounded-md w-full py-2 px-3 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Department"
              />
              {iconMap.department}
            </div>
            <div className="form-group relative">
              <label className="label" htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                type="text"
                required
                value={formData.designation}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Designation"
              />
              {iconMap.designation}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">{authType === 'login' ? 'Sign in' : 'Register'} to your account</h2>
          <p className="text-center text-gray-500 text-base mb-4">Welcome to the Alumni Portal</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {authType === 'register' && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="h-12 pl-12 pr-4 w-full bg-gray-100 border border-gray-300 rounded-lg text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Full Name"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{iconMap.fullName}</span>
              </div>
            </div>
          )}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 pl-12 pr-4 w-full bg-gray-100 border border-gray-300 rounded-lg text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Email"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{iconMap.email}</span>
            </div>
          </div>
          {authType === 'register' && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">Phone Number</label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="h-12 pl-12 pr-4 w-full bg-gray-100 border border-gray-300 rounded-lg text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Phone Number"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{iconMap.phoneNumber}</span>
              </div>
            </div>
          )}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 pl-12 pr-12 w-full bg-gray-100 border border-gray-300 rounded-lg text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Password"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{iconMap.password}</span>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((show) => !show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          {authType === 'register' && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-12 pl-12 pr-12 w-full bg-gray-100 border border-gray-300 rounded-lg text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Confirm Password"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{iconMap.confirmPassword}</span>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((show) => !show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          )}
          {/* Role-specific fields */}
          {authType === 'register' && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="space-y-4">{renderRoleSpecificFields()}</div>
            </>
          )}
          {/* Error message */}
          {(formError || error) && (
            <div className="text-red-600 mt-2 text-center text-sm font-medium animate-pulse">
              {formError || error}
            </div>
          )}
          <button
            type="submit"
            className="h-12 w-full bg-indigo-600 text-white rounded-lg font-semibold text-base shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            disabled={loading}
          >
            {loading ? 'Please wait...' : authType === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600 text-base">
            {authType === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          </span>
          <button
            onClick={() => { setAuthType(authType === 'login' ? 'register' : 'login'); setFormError(''); clearError(); }}
            className="text-indigo-600 hover:underline font-semibold text-base focus:outline-none ml-1"
          >
            {authType === 'login' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 