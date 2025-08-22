// Password requirements configuration
export const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  };
  
  // Input sanitization function
  export const sanitizeInput = (value, fieldName) => {
    if (typeof value !== 'string') return value;
    
    // Basic XSS prevention
    let sanitized = value
      .replace(/[<>]/g, '') // Remove < and >
      .trim();
  
    // Field-specific sanitization
    switch (fieldName) {
      case 'email':
        return sanitized.toLowerCase();
      case 'phoneNumber':
        return sanitized.replace(/[^0-9+\-\s]/g, ''); // Keep only numbers, +, -, and spaces
      case 'graduationYear':
        return sanitized.replace(/[^0-9]/g, ''); // Keep only numbers
      case 'currentSemester':
        return sanitized.replace(/[^0-9]/g, ''); // Keep only numbers
      default:
        return sanitized;
    }
  };
  
  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  
  // Phone number validation
  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[0-9\-\s]{10,15}$/;
    return phoneRegex.test(phone);
  };
  
  // Password validation
  const validatePassword = (password) => {
    const errors = [];
  
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
    }
  
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
  
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
  
    if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  
    if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  
    return errors;
  };
  
  // Main form validation function
  export const validateForm = (formData, authType, userRole) => {
    const errors = {};
  
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (authType === 'register') {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors[0];
      }
    }
  
    // Registration-specific validations
    if (authType === 'register') {
      // Full Name validation
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      } else if (formData.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters long';
      }
  
      // Phone Number validation
      if (!formData.phoneNumber) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!isValidPhone(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
  
      // Confirm Password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
  
      // Role-specific validations
      if (userRole === 'student') {
        if (!formData.currentSemester) {
          errors.currentSemester = 'Current semester is required';
        } else if (formData.currentSemester < 1 || formData.currentSemester > 8) {
          errors.currentSemester = 'Semester must be between 1 and 8';
        }
  
        if (!formData.rollNumber) {
          errors.rollNumber = 'Roll number is required';
        }
      }
  
      if (userRole === 'alumni') {
        if (!formData.graduationYear) {
          errors.graduationYear = 'Graduation year is required';
        } else {
          const year = parseInt(formData.graduationYear);
          const currentYear = new Date().getFullYear();
          if (year < 1950 || year > currentYear) {
            errors.graduationYear = 'Please enter a valid graduation year';
          }
        }
  
        if (!formData.currentJobTitle) {
          errors.currentJobTitle = 'Current job title is required';
        }
  
        if (!formData.companyName) {
          errors.companyName = 'Company name is required';
        }
      }
  
      if (userRole === 'faculty') {
        if (!formData.designation) {
          errors.designation = 'Designation is required';
        }
      }
  
      // Department validation for all roles
      if (!formData.department) {
        errors.department = 'Department is required';
      }
    }
  
    return errors;
  }; 