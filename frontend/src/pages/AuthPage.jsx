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
  student: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  alumni: 'bg-green-500/20 text-green-300 border-green-400/30',
  faculty: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  admin: 'bg-red-500/20 text-red-300 border-red-400/30',
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
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
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
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="1-8"
                  />
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
                  Roll Number
                </label>
                <div className="relative">
                  <input
                    name="rollNumber"
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="Roll no."
                  />
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                </div>
              </div>
            </div>
          </>
        );
      case 'alumni':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Graduation Year
              </label>
              <div className="relative">
                <input
                  name="graduationYear"
                  type="text"
                  required
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="e.g. 2020"
                />
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Current Job Title
              </label>
              <div className="relative">
                <input
                  name="currentJobTitle"
                  type="text"
                  required
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="Your job title"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Company Name
              </label>
              <div className="relative">
                <input
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="Company name"
                />
                <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
          </>
        );
      case 'faculty':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2 font-body">
                Designation
              </label>
              <div className="relative">
                <input
                  name="designation"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="Your designation"
                />
                <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display">
              {authType === 'login' && 'Welcome Back!'}
              {authType === 'register' && 'Join Us Today'}
              {authType === 'forgot' && (forgotStep === 1 ? 'Reset Password' : 'Verify OTP')}
            </h1>
            <p className="text-white/80 font-body">
              {authType === 'login' && 'Sign in to your account'}
              {authType === 'register' && 'Create your account'}
              {authType === 'forgot' && forgotStep === 1 && 'Enter your email to receive OTP'}
              {authType === 'forgot' && forgotStep === 2 && 'Enter OTP and new password'}
            </p>
          </div>

          {/* Auth Type Tabs */}
          {(authType === 'login' || authType === 'register') && (
            <div className="flex bg-white/10 backdrop-blur-xl rounded-full p-1 mb-6 border border-white/20">
              <button
                onClick={() => setAuthType('login')}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 font-body ${
                  authType === 'login'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthType('register')}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 font-body ${
                  authType === 'register'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
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
                <label className="block text-sm font-medium text-white mb-2 font-body">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="Enter your email"
                  />
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                </div>
              </div>
              
              {formError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 text-red-300 text-sm text-center font-body">
                  {formError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-primary-400 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 font-body"
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
                  className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors font-body"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD - STEP 2: OTP + PASSWORD */}
          {authType === 'forgot' && forgotStep === 2 && (
            <form className="space-y-6" onSubmit={handleForgotPasswordStep2}>
              <div className="text-center bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl p-4 mb-6 border border-white/20">
                <p className="text-sm text-white/80 mb-1 font-body">
                  OTP sent to <span className="font-semibold text-primary-400">{forgotEmail}</span>
                </p>
                {otpTimer > 0 && (
                  <p className="text-sm text-primary-400 font-medium font-body">
                    Expires in: {formatTimer(otpTimer)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
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
                  className="w-full py-3 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                  placeholder="0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
                  New Password
                </label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="New password"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    name="confirmNewPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="Confirm new password"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {formError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 text-red-300 text-sm text-center font-body">
                  {formError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-primary-400 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 font-body"
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
                  className="text-white/70 hover:text-white transition-colors font-body"
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
                    className="text-primary-400 hover:text-primary-300 disabled:text-primary-500 transition-colors font-body"
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
                  <label className="block text-sm font-medium text-white mb-2 font-body">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                      placeholder="Enter your full name"
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="Enter your email"
                  />
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                </div>
              </div>

              {authType === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2 font-body">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                      placeholder="Enter your phone number"
                    />
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-body">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                    placeholder="Enter your password"
                  />
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authType === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-body">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 text-white placeholder-white/50 font-body"
                        placeholder="Confirm your password"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 space-y-4 border border-white/20">
                    <h3 className="text-sm font-medium text-white text-center font-body">
                      Role-Specific Information
                    </h3>
                    {renderRoleSpecificFields()}
                  </div>
                </>
              )}
              
              {(formError || error) && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 text-red-300 text-sm text-center font-body">
                  {formError || error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-primary-400 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 font-body"
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
                    className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors font-body"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Role Display */}
              <div className="text-center mt-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-2xl border ${roleColors[selectedRole]} font-body`}>
                  <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                  {roleLabels[selectedRole]}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 