import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AuthForm from "./AuthForm";
import { authAPI } from "../middleware/api";
import { validateForm, sanitizeInput } from "../utils/validation";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const AuthPage = ({ onAuthSuccess = () => {} }) => {
  const navigate = useNavigate();
  const { alert, showAlert, clearAlert, handleError } = useAlert();

  // Auth state
  const [authType, setAuthType] = useState("login"); // "login" or "register"
  const [userRole, setUserRole] = useState(localStorage.getItem("selectedRole"));
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0); // seconds left
  const [loginAttempts, setLoginAttempts] = useState(0);

  // On mount: check if user is locked out (from localStorage)
  useEffect(() => {
    const lock = JSON.parse(localStorage.getItem("authLockout"));
    if (lock) {
      const delta = Date.now() - lock.timestamp;
      if (delta < LOCKOUT_DURATION) {
        setIsLocked(true);
        setLockoutTime((LOCKOUT_DURATION - delta) / 1000);
        setLoginAttempts(lock.attempts);
        showAlert(`Account locked. Try again in ${Math.ceil((LOCKOUT_DURATION - delta) / 60000)} minutes.`, 'error');
      } else {
        localStorage.removeItem("authLockout");
      }
    }
  }, [showAlert]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      setLockoutTime((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          localStorage.removeItem("authLockout");
          clearAlert();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, clearAlert]);

  // Input change handler with sanitization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: sanitizeInput(value, name) }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
    clearAlert();
  };

  // Form submit handler (login/register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAlert();

    if (isLocked) {
      showAlert(`Account locked. Try again in ${Math.ceil(lockoutTime / 60)} minutes.`, 'error');
      return;
    }

    const validationErrors = validateForm(formData, authType, userRole);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const apiData = {
        ...formData,
        role: userRole,
      };

      const resp = await authAPI[authType](apiData);

      if (resp.success) {
        if (authType === "login") {
          // Clear lockout info on successful login
          localStorage.removeItem("authLockout");
          localStorage.setItem("userRole", resp.data.role);
          onAuthSuccess(resp.data.role);
          showAlert('Successfully logged in!', 'success');
          navigate("/dashboard", { replace: true });
        } else {
          // After registration, switch to login form
          setAuthType("login");
          setFormData({ email: "", password: "" });
          setErrors({});
          showAlert('Account created successfully! Please log in.', 'success');
        }
      }
    } catch (err) {
      if (authType === "login") {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true);
          setLockoutTime(LOCKOUT_DURATION / 1000);
          localStorage.setItem(
            "authLockout",
            JSON.stringify({ timestamp: Date.now(), attempts })
          );
          showAlert(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 60000} minutes.`, 'error');
        } else {
          showAlert(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - attempts} attempts remaining.`, 'error');
        }
      } else {
        handleError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and register forms
  const toggleAuthType = () => {
    setAuthType(authType === "login" ? "register" : "login");
    setErrors({});
    setFormData({ email: "", password: "" });
    clearAlert();
  };

  // Go back to role selection page
  const handleBack = () => {
    localStorage.removeItem("selectedRole");
    setUserRole(null);
    clearAlert();
    navigate("/role-selection");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[400px] mx-auto px-8">
          {/* Top buttons */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <FiArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <button
              onClick={toggleAuthType}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              {authType === "login" ? "Create Account" : "Sign In"}
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {authType === "login" ? "Sign In" : "Register"} as {userRole}
          </h2>

          {/* Alert */}
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={clearAlert}
              className="mb-6"
            />
          )}

          {/* Auth form */}
          <AuthForm
            authType={authType}
            userRole={userRole}
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            isLocked={isLocked}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
