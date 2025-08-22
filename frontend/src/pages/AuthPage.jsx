import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiCalendar, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../middleware/api';

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

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, selectedRole, login, register, loading, error, clearError } = useAuth();
  const [authType, setAuthType] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password States
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp+password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false); // Loading state for OTP operations
  
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
    designation: '',
    // Forgot Password fields
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
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

  // OTP Timer Effect
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setFormError('');
  clearError();

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  if (!formData.password || formData.password.trim() === '') {
    toast.error("Password cannot be empty");
    return;
  }

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
        toast.error('Passwords do not match');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <div className="relative">
                  <input
                    name="currentSemester"
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="1-8"
                  />
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <div className="relative">
                  <input
                    name="rollNumber"
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="Roll no."
                  />
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>
          </>
        );
      case 'alumni':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year
              </label>
              <div className="relative">
                <input
                  name="graduationYear"
                  type="text"
                  required
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="e.g. 2020"
                />
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Job Title
              </label>
              <div className="relative">
                <input
                  name="currentJobTitle"
                  type="text"
                  required
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="Your job title"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <input
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="Company name"
                />
                <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </>
        );
      case 'faculty':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <div className="relative">
                <input
                  name="designation"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="Your designation"
                />
                <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Handler for Forgot Password Step 1: Send OTP
  const handleForgotPasswordStep1 = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(forgotEmail)) {
      setFormError('Please enter a valid email address');
      return;
    }

    setOtpLoading(true);
    try {
      await authAPI.forgotPassword(forgotEmail);
      toast.success('OTP sent to your email!');
      setForgotStep(2);
      setOtpTimer(600); // 10 minutes countdown
    } catch (err) {
      setFormError(err.message || 'Failed to send OTP');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handler for Forgot Password Step 2: Reset Password
  const handleForgotPasswordStep2 = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();
    
    if (!formData.otp || formData.otp.length !== 4) {
      setFormError('Please enter a valid 4-digit OTP');
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      await authAPI.resetPassword(forgotEmail, formData.otp, formData.newPassword);
      toast.success('Password reset successful!');
      
      // Reset to login form
      setAuthType('login');
      setForgotStep(1);
      setForgotEmail('');
      setOtpTimer(0);
      setFormData(prev => ({
        ...prev,
        otp: '',
        newPassword: '',
        confirmNewPassword: '',
        email: forgotEmail, // Pre-fill email for login
        password: ''
      }));
    } catch (err) {
      setFormError(err.message || 'Failed to reset password');
      toast.error(err.message || 'Failed to reset password');
    }
  };

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateLogin = () => {
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(formData.email)) {
    setFormError('Please enter a valid email address');
    return false;
  }
  if (!formData.password || formData.password.trim() === '') {
    setFormError('Password cannot be empty');
    return false;
  }
  return true;
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {authType === 'login' && 'Welcome Back!'}
              {authType === 'register' && 'Join Us Today'}
              {authType === 'forgot' && (forgotStep === 1 ? 'Reset Password' : 'Verify OTP')}
            </h1>
            <p className="text-gray-600">
              {authType === 'login' && 'Sign in to your account'}
              {authType === 'register' && 'Create your account'}
              {authType === 'forgot' && forgotStep === 1 && 'Enter your email to receive OTP'}
              {authType === 'forgot' && forgotStep === 2 && 'Enter OTP and new password'}
            </p>
          </div>

          {/* Auth Type Tabs */}
          {(authType === 'login' || authType === 'register') && (
            <div className="flex bg-gray-100 rounded-full p-1 mb-6">
              <button
                onClick={() => setAuthType('login')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                  authType === 'login'
                    ? 'bg-white shadow-md text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthType('register')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                  authType === 'register'
                    ? 'bg-white shadow-md text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD - STEP 1: EMAIL */}
          {authType === 'forgot' && forgotStep === 1 && (
            <form className="space-y-6" onSubmit={handleForgotPasswordStep1}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="Enter your email"
                  />
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 text-red-600 text-sm text-center">
                  {formError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthType('login');
                    setFormError('');
                    clearError();
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD - STEP 2: OTP + PASSWORD */}
          {authType === 'forgot' && forgotStep === 2 && (
            <form className="space-y-6" onSubmit={handleForgotPasswordStep2}>
              <div className="text-center bg-indigo-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  OTP sent to <span className="font-semibold text-indigo-600">{forgotEmail}</span>
                </p>
                {otpTimer > 0 && (
                  <p className="text-sm text-indigo-600 font-medium">
                    Expires in: {formatTimer(otpTimer)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 4-digit OTP
                </label>
                <input
                  name="otp"
                  type="text"
                  maxLength="4"
                  pattern="[0-9]{4}"
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="New password"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    name="confirmNewPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="Confirm new password"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 text-red-600 text-sm text-center">
                  {formError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
              
              <div className="flex justify-center space-x-4 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setFormError('');
                    clearError();
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Change Email
                </button>
                {otpTimer === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleForgotPasswordStep1({ preventDefault: () => {} });
                    }}
                    disabled={otpLoading}
                    className="text-indigo-600 hover:text-indigo-800 disabled:text-indigo-400 transition-colors"
                  >
                    {otpLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* LOGIN & REGISTER FORMS */}
          {(authType === 'login' || authType === 'register') && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {authType === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                      placeholder="Enter your full name"
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="Enter your email"
                  />
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {authType === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                      placeholder="Enter your phone number"
                    />
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    placeholder="Enter your password"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authType === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                        placeholder="Confirm your password"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 text-center">
                      Role-Specific Information
                    </h3>
                    {renderRoleSpecificFields()}
                  </div>
                </>
              )}
              
              {(formError || error) && (
                <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 text-red-600 text-sm text-center">
                  {formError || error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Please wait...
                  </div>
                ) : (
                  authType === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
              
              {authType === 'login' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthType('forgot');
                      setForgotStep(1);
                      setFormError('');
                      clearError();
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 