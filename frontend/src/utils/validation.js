// Password validation constants
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

// Password validation function
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
    return errors;
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (
    PASSWORD_REQUIREMENTS.requireSpecialChar &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  }

  // Additional security checks
  if (/(.)\1{2,}/.test(password)) {
    errors.push(
      "Password cannot contain 3 or more consecutive identical characters"
    );
  }

  // Check for common patterns
  const commonPatterns = [
    "password",
    "123456",
    "qwerty",
    "admin",
    "welcome",
    "letmein",
    "monkey",
    "dragon",
  ];
  if (
    commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))
  ) {
    errors.push("Password contains common patterns that are not allowed");
  }

  return errors;
};

// Input sanitization
export const sanitizeInput = (input, fieldName) => {
  if (typeof input !== "string") return "";
  
  let cleanValue = input.trim();

  // Field-specific sanitization
  switch (fieldName) {
    case 'fullName':
      return cleanValue.replace(/[^a-zA-Z\s.'-]/g, '');
    case 'currentSemester':
      return cleanValue.replace(/[^1-8]/g, '');
    case 'graduationYear':
      return cleanValue.replace(/[^0-9]/g, '');
    case 'rollNumber':
      return cleanValue.replace(/[^A-Za-z0-9\s-]/g, '');
    case 'department':
      return cleanValue.replace(/[^A-Za-z\s-]/g, '');
    case 'currentJobTitle':
      return cleanValue.replace(/[^A-Za-z\s.-]/g, '');
    case 'companyName':
      return cleanValue.replace(/[^A-Za-z0-9\s&.,'-]/g, '');
    case 'designation':
      return cleanValue.replace(/[^A-Za-z\s.,'-]/g, '');
    case 'phoneNumber':
      return cleanValue.replace(/[^0-9\s+-]/g, '');
    case 'email':
      return cleanValue.toLowerCase().trim();
    default:
      return cleanValue.replace(/[<>]/g, "").replace(/javascript:/gi, "");
  }
};

// Form validation
export const validateForm = (formData, authType, userRole) => {
  const errors = {};

  // Email validation
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (authType === "register") {
    const pwErrors = validatePassword(formData.password);
    if (pwErrors.length > 0) {
      errors.password = pwErrors.join(". ");
    }
  }

  // Registration-specific validation
  if (authType === "register") {
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Full name validation
    if (!formData.fullName) {
      errors.fullName = "Full name is required";
    } else {
      const nameRegex = /^[a-zA-Z\s.'-]+$/;
      if (!nameRegex.test(formData.fullName)) {
        errors.fullName = "Name should only contain letters, spaces, periods, apostrophes, and hyphens";
      }
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        errors.phoneNumber = "Please enter a valid phone number";
      }
    }

    // Role-specific validation
    switch (userRole) {
      case "alumni":
        if (!formData.graduationYear) {
          errors.graduationYear = "Graduation year is required";
        } else {
          const yearRegex = /^(19|20)\d{2}$/;
          if (!yearRegex.test(formData.graduationYear)) {
            errors.graduationYear = "Please enter a valid year (e.g., 2020)";
          }
        }
        if (!formData.department) {
          errors.department = "Department is required";
        }
        if (!formData.currentJobTitle) {
          errors.currentJobTitle = "Current job title is required";
        }
        if (!formData.companyName) {
          errors.companyName = "Company name is required";
        }
        break;

      case "faculty":
        if (!formData.designation) {
          errors.designation = "Designation is required";
        }
        if (!formData.department) {
          errors.department = "Department is required";
        }
        break;

      case "student":
        if (!formData.currentSemester) {
          errors.currentSemester = "Current semester is required";
        } else if (!/^[1-8]$/.test(formData.currentSemester)) {
          errors.currentSemester = "Please enter a valid semester (1-8)";
        }
        if (!formData.rollNumber) {
          errors.rollNumber = "Roll number is required";
        }
        break;
    }
  }

  return errors;
}; 