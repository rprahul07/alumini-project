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
                className="input pl-10"
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
                className="input pl-10"
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
                className="input pl-10"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card border border-gray-100 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 w-full max-w-md p-8 sm:p-10 relative">
        {/* Role badge */}
        {selectedRole && (
          <div className={`absolute -top-4 left-6 px-3 py-0.5 rounded-full shadow-sm text-xs font-semibold border ${roleColors[selectedRole] || 'bg-gray-50 text-gray-700'}`}
            style={{ zIndex: 2 }}
          >
            {authType === 'login' ? 'Logging in as:' : 'Registering as:'} {roleLabels[selectedRole] || selectedRole}
          </div>
        )}
        <div className="flex flex-col items-center mb-6 mt-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{authType === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="text-sm text-gray-500 mb-2">{authType === 'login' ? 'Sign in to access your account' : 'Join our community and connect with others'}</p>
          {/* Auth Type Toggle */}
          <div className="flex justify-center space-x-2 mt-2 mb-2">
            <button
              type="button"
              onClick={() => setAuthType('login')}
              className={`btn ${authType === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthType('register')}
              className={`btn ${authType === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Register
            </button>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          {authType === 'register' && (
            <div className="form-group relative">
              <label className="label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Full Name"
              />
              {iconMap.fullName}
            </div>
          )}
          <div className="form-group relative">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input pl-10"
              placeholder="Email"
            />
            {iconMap.email}
          </div>
          {authType === 'register' && (
            <div className="form-group relative">
              <label className="label" htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="Phone Number"
              />
              {iconMap.phoneNumber}
            </div>
          )}
          <div className="form-group relative">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="input pl-10 pr-10"
              placeholder="Password"
            />
            {iconMap.password}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((show) => !show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {authType === 'register' && (
            <div className="form-group relative">
              <label className="label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input pl-10 pr-10"
                placeholder="Confirm Password"
              />
              {iconMap.confirmPassword}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((show) => !show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          )}
          {/* Role-specific fields */}
          {authType === 'register' && renderRoleSpecificFields()}
          {/* Error message */}
          {(formError || error) && (
            <div className="error-message text-center animate-pulse">
              {formError || error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full mt-2 shadow"
            disabled={loading}
          >
            {loading ? 'Please wait...' : authType === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">
            {authType === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          </span>
          <button
            onClick={() => { setAuthType(authType === 'login' ? 'register' : 'login'); setFormError(''); clearError(); }}
            className="text-indigo-600 hover:underline font-semibold text-sm focus:outline-none"
          >
            {authType === 'login' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 