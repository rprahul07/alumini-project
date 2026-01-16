import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiCalendar, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../middleware/api';
import { useInteractionTracking, useAnalytics } from '../hooks/useAnalytics';

const roleLabels = {
  student: 'Student',
  alumni: 'Alumni',
  faculty: 'Faculty',
  admin: 'Admin',
};

const roleColors = {
  student: 'bg-blue-50 text-blue-700 border-blue-200',
  alumni: 'bg-green-50 text-green-700 border-green-200',
  faculty: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-red-50 text-red-700 border-red-200',
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, selectedRole, login, register, loading, error, clearError } = useAuth();
  const [authType, setAuthType] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // Analytics tracking
  const { trackClick, trackSubmit, trackFocus } = useInteractionTracking('auth');
  const { trackEngagement, trackConversion } = useAnalytics();

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

    // Track form submission attempt
    trackSubmit(e.target, `auth_${authType}_form`);

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
        // Track login attempt
        trackConversion('login_attempt', {
          user_role: selectedRole,
          email_domain: formData.email.split('@')[1]
        });

        const result = await login({
          email: formData.email,
          password: formData.password,
          role: selectedRole
        });
        if (result.success) {
          // Track successful login
          trackConversion('login_success', {
            user_role: selectedRole,
            user_id: result.user?.id
          });
          toast.success('Login successful!');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        // Track registration attempt
        trackConversion('registration_attempt', {
          user_role: selectedRole,
          email_domain: formData.email.split('@')[1]
        });

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
          // Track successful registration
          trackConversion('registration_success', {
            user_role: selectedRole,
            user_id: result.user?.id
          });
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
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="1-8"
                  />
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                  Roll Number
                </label>
                <div className="relative">
                  <input
                    name="rollNumber"
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="Roll no."
                  />
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </div>
          </>
        );
      case 'alumni':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Graduation Year
              </label>
              <div className="relative">
                <input
                  name="graduationYear"
                  type="text"
                  required
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="e.g. 2020"
                />
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Current Job Title
              </label>
              <div className="relative">
                <input
                  name="currentJobTitle"
                  type="text"
                  required
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="Your job title"
                />
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Company Name
              </label>
              <div className="relative">
                <input
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="Company name"
                />
                <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
          </>
        );
      case 'faculty':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Department
              </label>
              <div className="relative">
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="Your department"
                />
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                Designation
              </label>
              <div className="relative">
                <input
                  name="designation"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                  placeholder="Your designation"
                />
                <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white py-6 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 p-5 animate-slide-up">

          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-200">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-slate-900 mb-1 font-sans">
              {authType === 'login' && 'Welcome Back!'}
              {authType === 'register' && 'Join Us Today'}
              {authType === 'forgot' && (forgotStep === 1 ? 'Reset Password' : 'Verify OTP')}
            </h1>
            <p className="text-xs text-slate-600 font-sans">
              {authType === 'login' && 'Sign in to your account'}
              {authType === 'register' && 'Create your account'}
              {authType === 'forgot' && forgotStep === 1 && 'Enter your email to receive OTP'}
              {authType === 'forgot' && forgotStep === 2 && 'Enter OTP and new password'}
            </p>
          </div>

          {/* Auth Type Tabs */}
          {(authType === 'login' || authType === 'register') && (
            <div className="flex bg-slate-100 rounded-lg p-1 mb-3 border border-slate-200">
              <button
                onClick={() => setAuthType('login')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-300 font-sans ${authType === 'login'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthType('register')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-300 font-sans ${authType === 'register'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
              >
                Register
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD - STEP 1: EMAIL */}
          {authType === 'forgot' && forgotStep === 1 && (
            <form className="space-y-4" onSubmit={handleForgotPasswordStep1}>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="Enter your email"
                  />
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-xs text-center font-sans">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-primary-400 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 font-sans text-sm"
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
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors font-sans"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD - STEP 2: OTP + PASSWORD */}
          {authType === 'forgot' && forgotStep === 2 && (
            <form className="space-y-4" onSubmit={handleForgotPasswordStep2}>
              <div className="text-center bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-3 mb-4 border border-slate-200">
                <p className="text-xs text-slate-600 mb-1 font-sans">
                  OTP sent to <span className="font-semibold text-primary-600">{forgotEmail}</span>
                </p>
                {otpTimer > 0 && (
                  <p className="text-xs text-primary-600 font-medium font-sans">
                    Expires in: {formatTimer(otpTimer)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
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
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans"
                  placeholder="0000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                  New Password
                </label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="New password"
                  />
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    name="confirmNewPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="Confirm new password"
                  />
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-3 py-2 text-red-600 text-xs text-center font-sans">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-primary-400 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 font-sans text-sm"
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
                  className="text-slate-600 hover:text-slate-900 transition-colors font-sans text-xs"
                >
                  Change Email
                </button>
                {otpTimer === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleForgotPasswordStep1({ preventDefault: () => { } });
                    }}
                    disabled={otpLoading}
                    className="text-primary-600 hover:text-primary-700 disabled:text-primary-400 transition-colors font-sans text-xs"
                  >
                    {otpLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* LOGIN & REGISTER FORMS */}
          {(authType === 'login' || authType === 'register') && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {authType === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                      placeholder="Enter your full name"
                    />
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="Enter your email"
                  />
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {authType === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                      placeholder="Enter your phone number"
                    />
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                    placeholder="Enter your password"
                  />
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authType === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-slate-900 placeholder-slate-500 font-sans text-sm"
                        placeholder="Confirm your password"
                      />
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  <div className="bg-slate-50 rounded-2xl p-3 space-y-3 border border-slate-200">
                    <h3 className="text-xs font-medium text-slate-700 text-center font-sans">
                      Role-Specific Information
                    </h3>
                    {renderRoleSpecificFields()}
                  </div>
                </>
              )}

              {(formError || error) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-3 py-2 text-red-600 text-xs text-center font-sans">
                  {formError || error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                onClick={() => trackClick(null, `auth_${authType}_submit_button`)}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-primary-400 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 font-sans text-sm"
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
                      trackClick(null, 'forgot_password_button');
                      setAuthType('forgot');
                      setForgotStep(1);
                      setFormError('');
                      clearError();
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium text-xs transition-colors font-sans"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Role Display */}
              <div className="text-center mt-4">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border ${roleColors[selectedRole]} font-sans text-xs`}>
                  <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></div>
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