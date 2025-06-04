import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import { validateField } from '../utils/errorHandling';
import useAlert from '../hooks/useAlert';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({
  authType,
  userRole,
}) => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const { alert, showAlert, clearAlert, handleError } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    department: '',
    // Role-specific fields
    currentSemester: '',
    rollNumber: '',
    graduationYear: '',
    currentJobTitle: '',
    companyName: '',
    designation: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormErrors({});
    clearAlert();
  }, [authType, clearAlert]);

  const validateForm = () => {
    const errors = {};
    
    // Validate common fields
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (authType === 'register') {
      // Registration validations
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }

      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
      }

      if (!formData.department.trim()) {
        errors.department = 'Department is required';
      }

      // Role-specific validations
      if (userRole === 'student') {
        if (!formData.currentSemester.trim()) {
          errors.currentSemester = 'Current semester is required';
        }
        if (!formData.rollNumber.trim()) {
          errors.rollNumber = 'Roll number is required';
        }
      } else if (userRole === 'alumni') {
        if (!formData.graduationYear) {
          errors.graduationYear = 'Graduation year is required';
        }
        if (!formData.currentJobTitle.trim()) {
          errors.currentJobTitle = 'Current job title is required';
        }
        if (!formData.companyName.trim()) {
          errors.companyName = 'Company name is required';
        }
      } else if (userRole === 'faculty') {
        if (!formData.designation.trim()) {
          errors.designation = 'Designation is required';
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      showAlert(firstError, 'error');
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear alert when user starts typing
    clearAlert();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAlert();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (authType === 'login') {
        const loginData = {
          email: formData.email,
          password: formData.password,
          role: userRole,
        };

        console.log('Attempting login with:', { ...loginData, password: '[REDACTED]' });
        const response = await login(loginData);
        
        if (response?.success) {
          console.log('Login successful, preparing to navigate');
          showAlert('Login successful! Redirecting to dashboard...', 'success');
          
          // Ensure we have the role before navigating
          const storedRole = localStorage.getItem('userRole');
          console.log('Stored role before navigation:', storedRole);
          
          // Add a small delay to ensure state updates are processed
          setTimeout(() => {
            console.log('Navigating to dashboard...');
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          console.log('Login response indicated failure:', response);
          showAlert('Login failed. Please check your credentials.', 'error');
        }
      } else {
        const registerData = {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
          role: userRole,
        };

        // Add role-specific fields
        if (userRole === 'student') {
          Object.assign(registerData, {
            currentSemester: formData.currentSemester,
            rollNumber: formData.rollNumber,
          });
        } else if (userRole === 'alumni') {
          Object.assign(registerData, {
            graduationYear: parseInt(formData.graduationYear),
            currentJobTitle: formData.currentJobTitle,
            companyName: formData.companyName,
          });
        } else if (userRole === 'faculty') {
          Object.assign(registerData, {
            designation: formData.designation,
          });
        }

        const response = await register(registerData);
        
        if (response?.success) {
          showAlert('Registration successful! Please log in.', 'success');
          // Reset form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            phoneNumber: '',
            department: '',
            currentSemester: '',
            rollNumber: '',
            graduationYear: '',
            currentJobTitle: '',
            companyName: '',
            designation: '',
          });
          // Short delay before redirecting to login
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      handleError(err);
      // Show specific error messages for common cases
      if (err.message.includes('Invalid email or password')) {
        showAlert('Invalid email or password. Please try again.', 'error');
      } else if (err.message.includes('Email already exists')) {
        showAlert('This email is already registered. Please try logging in.', 'error');
      } else {
        showAlert(err.message || 'An error occurred. Please try again.', 'error');
      }
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign In
    console.log('Google Sign In clicked');
  };

  const handleGitHubSignIn = () => {
    // Implement GitHub Sign In
    console.log('GitHub Sign In clicked');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={clearAlert}
          className="mb-4"
        />
      )}

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <FcGoogle className="w-5 h-5 mr-3" />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={handleGitHubSignIn}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <BsGithub className="w-5 h-5 mr-3" />
          Continue with GitHub
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {authType === 'register' && (
          <>
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  placeholder="Full Name"
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  placeholder="Phone Number"
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  placeholder="Department"
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.department && (
                <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {userRole === 'student' && (
              <>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="currentSemester"
                      value={formData.currentSemester}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      placeholder="Current Semester"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.currentSemester && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.currentSemester}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      placeholder="Roll Number"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.rollNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.rollNumber}</p>
                  )}
                </div>
              </>
            )}

            {userRole === 'alumni' && (
              <>
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      placeholder="Graduation Year"
                      min="1900"
                      max={new Date().getFullYear()}
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.graduationYear && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.graduationYear}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="currentJobTitle"
                      value={formData.currentJobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      placeholder="Current Job Title"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.currentJobTitle && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.currentJobTitle}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      placeholder="Company Name"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>
                  )}
                </div>
              </>
            )}

            {userRole === 'faculty' && (
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    placeholder="Designation"
                    disabled={loading}
                    required
                  />
                </div>
                {formErrors.designation && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.designation}</p>
                )}
              </div>
            )}
          </>
        )}

        <div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
            <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder="••••••••"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        {authType === 'register' && (
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="Confirm Password"
                disabled={loading}
                required
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
            )}
          </div>
        )}
      </div>

      {authType === 'login' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
              Forgot your password?
            </a>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors font-medium"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            Processing...
          </div>
        ) : (
          authType === 'login' ? 'Sign In' : 'Create Account'
        )}
      </button>
    </form>
  );
};

export default AuthForm;
