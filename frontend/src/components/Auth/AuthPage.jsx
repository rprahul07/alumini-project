import React, { useState, useEffect } from "react";
import RoleSelection from "./RoleSelection";
import AuthForm from "./AuthForm";
import "./AuthPage.css";
import { authAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ onAuthSuccess }) => {
  // State for login/register toggling
  const [authType, setAuthType] = useState("login");

  // State to track selected user role (alumni, faculty, student)
  const [userRole, setUserRole] = useState(null);

  // Form data state for all fields
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
    ...(authType === "register" && {
      fullName: "",
      phoneNumber: "",
      confirmPassword: "",
      graduationYear: "",
      department: "",
      currentJobTitle: "",
      companyName: "",
      designation: "",
      currentSemester: "",
      rollNumber: "",
    }),
  });

  // Errors for input field
  const [errors, setErrors] = useState({});

  // Loading states for api calls
  const [isLoading, setIsLoading] = useState(false);

  // Success message to display on successful login/register
  const [successMessage, setSuccessMessage] = useState("");

  // Account lockout for brute force prevention
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const navigate = useNavigate();

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
    return input.replace(/[<>]/g, "").trim();
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
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate the whole form based on auth type and user role
  const validateForm = () => {
    const validationErrors = {};

    // Email validation
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (authType === "login") {
      // For login, only check if password is not empty
      if (formData.password.length === 0) {
        validationErrors.password = "Password is required";
      }
    } else {
      // For registration, check password strength
      const pwErrors = validatePassword(formData.password);
      if (pwErrors.length > 0) {
        validationErrors.password = pwErrors.join(". ");
      }
    }

    // Only validate registration-specific fields if registering
    if (authType === "register") {
      // Confirm password validation
      if (!formData.confirmPassword) {
        validationErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }

      // Full name validation
      if (!formData.fullName || formData.fullName.trim() === "") {
        validationErrors.fullName = "Full name is required";
      }

      // Phone number validation
      if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
        validationErrors.phoneNumber = "Phone number is required";
      } else {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
          validationErrors.phoneNumber = "Please enter a valid phone number";
        }
      }

      // Role-specific validation
      switch (userRole) {
        case "alumni":
          if (
            !formData.graduationYear ||
            formData.graduationYear.trim() === ""
          ) {
            validationErrors.graduationYear = "Graduation year is required";
          }
          if (!formData.department || formData.department.trim() === "") {
            validationErrors.department = "Department is required";
          }
          if (
            !formData.currentJobTitle ||
            formData.currentJobTitle.trim() === ""
          ) {
            validationErrors.currentJobTitle = "Current job title is required";
          }
          if (!formData.companyName || formData.companyName.trim() === "") {
            validationErrors.companyName = "Company name is required";
          }
          break;

        case "faculty":
          if (!formData.designation || formData.designation.trim() === "") {
            validationErrors.designation = "Designation is required";
          }
          if (!formData.department || formData.department.trim() === "") {
            validationErrors.department = "Department is required";
          }
          break;

        case "student":
          if (!formData.department || formData.department.trim() === "") {
            validationErrors.department = "Department is required";
          }
          if (
            !formData.currentSemester ||
            formData.currentSemester.trim() === ""
          ) {
            validationErrors.currentSemester = "Current semester is required";
          }
          if (!formData.rollNumber || formData.rollNumber.trim() === "") {
            validationErrors.rollNumber = "Roll number is required";
          }
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
      errors.push(
        `Password must be at least ${passwordRequirements.minLength} characters long`
      );
    }
    if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (passwordRequirements.requireNumber && !/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (
      passwordRequirements.requireSpecialChar &&
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

    // Check for sequential characters
    if (
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
        password
      )
    ) {
      errors.push("Password cannot contain sequential characters");
    }

    return errors;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});
    if (isLocked) {
      setErrors({
        submit: `Account locked. Please try again after ${lockoutTime} minutes.`,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Base user data
      const userData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: userRole,
      };

      // Add role-specific fields
      if (userRole === "alumni") {
        userData.graduationYear = formData.graduationYear;
        userData.department = formData.department;
        userData.currentJobTitle = formData.currentJobTitle;
        userData.companyName = formData.companyName;
      } else if (userRole === "faculty") {
        userData.designation = formData.designation;
        userData.department = formData.department;
      } else if (userRole === "student") {
        userData.department = formData.department;
        userData.currentSemester = formData.currentSemester;
        userData.rollNumber = formData.rollNumber;
      }

      if (authType === "login") {
        const response = await authAPI.login(userData);
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        if (onAuthSuccess) {
          onAuthSuccess(userRole);
        }
        navigate("/dashboard");
      } else {
        await authAPI.register(userData);
        setSuccessMessage("Registration successful! You can now log in.");
        if (onAuthSuccess) {
          setTimeout(() => {
            setAuthType("login");
            setUserRole(null);
          }, 2000);
        }
      }

      // Reset form after success
      setFormData({
        email: "",
        password: "",
        ...(authType === "register" && {
          fullName: "",
          phoneNumber: "",
          confirmPassword: "",
          graduationYear: "",
          department: "",
          currentJobTitle: "",
          companyName: "",
          designation: "",
          currentSemester: "",
          rollNumber: "",
        }),
      });
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes("Email already exists")) {
        setErrors({
          email:
            "This email is already registered. Please use a different email or try logging in.",
          submit: "Registration failed: Email already exists",
        });
      } else if (error.message.includes("Invalid credentials")) {
        setErrors({ submit: "Invalid email or password. Please try again." });
      } else if (error.response?.status === 401) {
        setIsLocked(true);
        setLockoutTime(15);
        setTimeout(() => setIsLocked(false), 15 * 60 * 1000);
        setErrors({
          submit: "Too many failed attempts. Account locked for 15 minutes.",
        });
      } else {
        setErrors({
          submit: error.message || "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.googleAuth(/* token */);
      if (onAuthSuccess) {
        onAuthSuccess(response.role);
      }
    } catch (error) {
      setErrors({
        submit: error.message || "Google sign-in failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update formData when authType changes
  useEffect(() => {
    if (authType === "login") {
      setFormData({
        email: "",
        password: "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        graduationYear: "",
        department: "",
        currentJobTitle: "",
        companyName: "",
        designation: "",
        currentSemester: "",
        rollNumber: "",
      });
    }
  }, [authType]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Toggle between Login and Register */}
        <div className="auth-tabs">
          <button
            className={authType === "login" ? "active" : ""}
            onClick={() => {
              setAuthType("login");
              setUserRole(null);
              setErrors({});
              setSuccessMessage("");
            }}
          >
            Login
          </button>
          <button
            className={authType === "register" ? "active" : ""}
            onClick={() => {
              setAuthType("register");
              setUserRole(null);
              setErrors({});
              setSuccessMessage("");
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
            setSuccessMessage("");
            setFormData({
              email: "",
              password: "",
              ...(authType === "register" && {
                fullName: "",
                phoneNumber: "",
                confirmPassword: "",
                graduationYear: "",
                department: "",
                currentJobTitle: "",
                companyName: "",
                designation: "",
                currentSemester: "",
                rollNumber: "",
              }),
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
