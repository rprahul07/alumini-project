import React, { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import RoleSelection from './RoleSelection';
import AuthForm from './AuthForm';
import './AuthPage.css';
import { authAPI } from '../../services/api';

const AuthPage = ({ onAuthSuccess }) => {
  // State for login/register toggling
  const [authType, setAuthType] = useState('login');

  // State to track selected user role (alumni, faculty, student)
  const [userRole, setUserRole] = useState(null);

  // Form data state for all fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    department: '',
    currentJobTitle: '',
    companyName: '',
    designation: '',
    currentSemester: '',
    rollNumber: '',
  });

  // Errors for input field
  const [errors, setErrors] = useState({});

  // Loading states for api calls
  const [isLoading, setIsLoading] = useState(false);

  // Success message to display on successful login/register
  const [successMessage, setSuccessMessage] = useState('');

  // Account lockout for brute force prevention
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Get CSRF token from cookie
  const getCsrfToken = () => {
    const name = 'XSRF-TOKEN';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Configure axios defaults
  useEffect(() => {
    // Set default headers for all requests
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.withCredentials = true; // Important for cookies

    // Add response interceptor to handle CSRF token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 419) { // CSRF token mismatch
          // Refresh the page to get a new CSRF token
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }, []);

  // Password rules
  const passwordRequirements = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  };

  // Sanitize user input to prevent XSS attacks (removing < and > characters) 
  function sanitizeInput(input) {
    return input.replace(/[<>]/g, '').trim();
  }

  // Handle changes in input fields and sanitize them using sanitizing function and replace the fields name and value after sanitization rest of the feilds remians same.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));

    // Clear error message for this field if any
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate the whole form based on auth type and user role
  const validateForm = () => {
    const validationErrors = {};

    // Email validation
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else {
      const pwErrors = validatePassword(formData.password);
      if (pwErrors.length > 0) {
        validationErrors.password = pwErrors.join('. ');
      }
    }

    // Confirm password for registration
    if (authType === 'register') {
      if (!formData.confirmPassword) {
        validationErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Full name validation
    if (!formData.fullName) {
      validationErrors.fullName = 'Full name is required';
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    } else {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        validationErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    // Role-specific validation on registration
    if (authType === 'register') {
      switch (userRole) {
        case 'alumni':
          if (!formData.graduationYear) validationErrors.graduationYear = 'Graduation year is required';
          if (!formData.department) validationErrors.department = 'Department is required';
          if (!formData.currentJobTitle) validationErrors.currentJobTitle = 'Current job title is required';
          if (!formData.companyName) validationErrors.companyName = 'Company name is required';
          break;

        case 'faculty':
          if (!formData.designation) validationErrors.designation = 'Designation is required';
          if (!formData.department) validationErrors.department = 'Department is required';
          break;

        case 'student':
          if (!formData.department) validationErrors.department = 'Department is required';
          if (!formData.currentSemester) validationErrors.currentSemester = 'Current semester is required';
          if (!formData.rollNumber) validationErrors.rollNumber = 'Roll number is required';
          break;

        default:
          break;
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Password validation logic based on the requirements
  function validatePassword(password) {
    const errors = [];

    if (password.length < passwordRequirements.minLength) {
      errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
    }
    if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (passwordRequirements.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (passwordRequirements.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Additional security checks
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain 3 or more consecutive identical characters');
    }
    
    // Check for common patterns
    const commonPatterns = [
      'password', '123456', 'qwerty', 'admin',
      'welcome', 'letmein', 'monkey', 'dragon'
    ];
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      errors.push('Password contains common patterns that are not allowed');
    }

    // Check for sequential characters
    if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      errors.push('Password cannot contain sequential characters');
    }

    return errors;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    if (isLocked) {
      setErrors({ submit: `Account locked. Please try again after ${lockoutTime} minutes.` });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        ...formData,
        role: userRole,
      };

      const response = authType === 'login' 
        ? await authAPI.login(userData)
        : await authAPI.register(userData);

      // Show success message
      const successMsg = authType === 'login' 
        ? 'Login successful! Redirecting to dashboard...' 
        : 'Registration successful! You can now log in.';
      setSuccessMessage(successMsg);

      if (onAuthSuccess) {
        // For login, redirect immediately
        if (authType === 'login') {
          onAuthSuccess(userRole);
        } else {
          // For registration, wait 2 seconds to show success message then redirect to login
          setTimeout(() => {
            setAuthType('login');
            setUserRole(null);
          }, 2000);
        }
      }

      // Reset form after success
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        graduationYear: '',
        department: '',
        currentJobTitle: '',
        companyName: '',
        designation: '',
        currentSemester: '',
        rollNumber: '',
      });
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes('Email already exists')) {
        setErrors({
          email: 'This email is already registered. Please use a different email or try logging in.',
          submit: 'Registration failed: Email already exists'
        });
      } else if (error.message.includes('Invalid credentials')) {
        setErrors({ submit: 'Invalid email or password. Please try again.' });
      } else if (error.response?.status === 401) {
        setIsLocked(true);
        setLockoutTime(15);
        setTimeout(() => setIsLocked(false), 15 * 60 * 1000);
        setErrors({ submit: 'Too many failed attempts. Account locked for 15 minutes.' });
      } else {
        setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Implement Google OAuth flow here
      const response = await authAPI.googleAuth(/* token */);
      if (onAuthSuccess) {
        onAuthSuccess(response.role);
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Toggle between Login and Register */}
        <div className="auth-tabs">
          <button
            className={authType === 'login' ? 'active' : ''}
            onClick={() => {
              setAuthType('login');
              setUserRole(null);
              setErrors({});
              setSuccessMessage('');
            }}
          >
            Login
          </button>
          <button
            className={authType === 'register' ? 'active' : ''}
            onClick={() => {
              setAuthType('register');
              setUserRole(null);
              setErrors({});
              setSuccessMessage('');
            }}
          >
            Register
          </button>
        </div>

        {/* If no role selected, show role selection and set state for role */}
        {!userRole ? (
          <RoleSelection authType={authType} setUserRole={setUserRole} />
        ) : (
          <AuthForm
            authType={authType}
            userRole={userRole}
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            isLocked={isLocked}
            passwordRequirements={passwordRequirements}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleGoogleSignIn={handleGoogleSignIn}
            successMessage={successMessage}
          />
        )}

        {/* Back button to reset role and form, on clicking back button the the stored data should be cleared */}
        <button
          className="back-btn"
          onClick={() => {
            setUserRole(null);
            setErrors({});
            setSuccessMessage('');
            setFormData({
              fullName: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: '',
              graduationYear: '',
              department: '',
              currentJobTitle: '',
              companyName: '',
              designation: '',
              currentSemester: '',
              rollNumber: '',
            });
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
