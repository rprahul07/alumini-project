// ✅ Cleaned & Optimized - Placeholder-safe
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import Alert from "../components/Alert";
import useAlert from "../hooks/useAlert";

const AuthForm = ({ authType, userRole, onSubmit, error, loading }) => {
  const { alert, showAlert, clearAlert, handleError } = useAlert();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    department: "",
    currentSemester: "",
    rollNumber: "",
    graduationYear: "",
    currentJobTitle: "",
    companyName: "",
    designation: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (authType === "register") {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!formData.fullName.trim()) {
        errors.fullName = "Full name is required";
      }

      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required";
      }

      if (!formData.department.trim()) {
        errors.department = "Department is required";
      }

      if (userRole === "student") {
        if (!formData.currentSemester.trim()) {
          errors.currentSemester = "Current semester is required";
        }
        if (!formData.rollNumber.trim()) {
          errors.rollNumber = "Roll number is required";
        }
      } else if (userRole === "alumni") {
        if (!formData.graduationYear) {
          errors.graduationYear = "Graduation year is required";
        }
        if (!formData.currentJobTitle.trim()) {
          errors.currentJobTitle = "Current job title is required";
        }
        if (!formData.companyName.trim()) {
          errors.companyName = "Company name is required";
        }
      } else if (userRole === "faculty") {
        if (!formData.designation.trim()) {
          errors.designation = "Designation is required";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      showAlert(firstError, "error");
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
      if (authType === "login") {
        const loginData = {
          email: formData.email,
          password: formData.password,
          role: userRole,
        };
        await onSubmit(loginData);
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

        if (userRole === "student") {
          Object.assign(registerData, {
            currentSemester: formData.currentSemester,
            rollNumber: formData.rollNumber,
          });
        } else if (userRole === "alumni") {
          Object.assign(registerData, {
            graduationYear: parseInt(formData.graduationYear),
            currentJobTitle: formData.currentJobTitle,
            companyName: formData.companyName,
          });
        } else if (userRole === "faculty") {
          Object.assign(registerData, {
            designation: formData.designation,
          });
        }

        console.log("Its getting here");
        await onSubmit(registerData);
      }
    } catch (err) {
      handleError(err);
      if (err.message.includes("Invalid email or password")) {
        showAlert("Invalid email or password. Please try again.", "error");
      } else if (err.message.includes("Email already exists")) {
        showAlert(
          "This email is already registered. Please try logging in.",
          "error"
        );
      } else {
        showAlert(
          err.message || "An error occurred. Please try again.",
          "error"
        );
      }
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
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

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
          disabled={loading}
        >
          <FcGoogle className="w-5 h-5 mr-3" />
          Continue with Google
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
        {authType === "register" && (
          <>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="John Doe"
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="+91 9876543210"
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Computer Science"
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.department && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.department}
                </p>
              )}
            </div>

            {userRole === "student" && (
              <>
                <div>
                  <label
                    htmlFor="currentSemester"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Semester
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      id="currentSemester"
                      name="currentSemester"
                      value={formData.currentSemester}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                      placeholder="6th Semester"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.currentSemester && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.currentSemester}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="rollNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Roll Number
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserGroupIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                      placeholder="CS2023001"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.rollNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.rollNumber}
                    </p>
                  )}
                </div>
              </>
            )}

            {userRole === "alumni" && (
              <>
                <div>
                  <label
                    htmlFor="graduationYear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Graduation Year
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="number"
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                      placeholder="2023"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.graduationYear && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.graduationYear}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="currentJobTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Job Title
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BriefcaseIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      id="currentJobTitle"
                      name="currentJobTitle"
                      value={formData.currentJobTitle}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                      placeholder="Software Engineer"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.currentJobTitle && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.currentJobTitle}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                      placeholder="Tech Corp"
                      disabled={loading}
                      required
                    />
                  </div>
                  {formErrors.companyName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.companyName}
                    </p>
                  )}
                </div>
              </>
            )}

            {userRole === "faculty" && (
              <div>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Designation
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserGroupIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                    placeholder="Assistant Professor"
                    disabled={loading}
                    required
                  />
                </div>
                {formErrors.designation && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.designation}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        {authType === "register" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {authType === "login" ? "Signing in..." : "Creating account..."}
              </span>
            ) : authType === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AuthForm;
