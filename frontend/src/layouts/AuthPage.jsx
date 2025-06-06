import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AuthForm from "./AuthForm";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { validateForm } from "../utils/validation";
import { useAuth } from "../contexts/AuthContext";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const AuthPage = ({ onAuthSuccess = () => {} }) => {
  const navigate = useNavigate();
  const { alert, showAlert, clearAlert, handleError } = useAlert();
  const { login, register, error: authError } = useAuth();

  const [authType, setAuthType] = useState("login");
  const [userRole, setUserRole] = useState(localStorage.getItem("selectedRole"));
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Check lockout status
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

  // Handle lockout timer
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

  // Show auth errors
  useEffect(() => {
    if (authError) showAlert(authError, "error");
  }, [authError, showAlert]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    clearAlert();

    if (isLocked) {
      showAlert(`Account locked. Try again in ${Math.ceil(lockoutTime / 60)} minutes.`, 'error');
      return;
    }

    const validationErrors = validateForm(formData, authType, userRole);
    if (Object.keys(validationErrors).length) return;

    setIsLoading(true);

    try {
      const apiData = { ...formData, role: userRole };

      if (authType === "login") {
        console.log('Attempting login with data:', apiData);
        const resp = await login(apiData);
        console.log('Login response:', resp);

        if (resp.success) {
          console.log('Login successful, setting up navigation...');
          localStorage.removeItem("authLockout");
          localStorage.setItem("userRole", userRole);
          onAuthSuccess(userRole);
          showAlert("Successfully logged in!", "success");
          
          console.log('Current userRole:', userRole);
          console.log('Stored userRole:', localStorage.getItem('userRole'));
          
          setTimeout(() => {
            console.log('Attempting navigation to dashboard...');
            navigate('/dashboard', { replace: true });
          }, 500);
        } else {
          handleFailedLogin();
        }
      } else {
        const resp = await register(apiData);
        if (resp.success) {
          setAuthType("login");
          showAlert("Account created successfully! Please log in.", "success");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle failed login attempts
  const handleFailedLogin = () => {
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
  };

  // Toggle between login and register
  const toggleAuthType = () => {
    setAuthType(authType === "login" ? "register" : "login");
    clearAlert();
  };

  // Handle back navigation
  const handleBack = () => {
    localStorage.removeItem("selectedRole");
    setUserRole(null);
    clearAlert();
    navigate("/role-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {authType === "login" ? "Welcome Back!" : "Join Our Community"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {authType === "login" ? "Sign in to access your dashboard" : "Create your account to get started"}
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
              >
                <FiArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              <button
                onClick={toggleAuthType}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                {authType === "login" ? "Create Account" : "Sign In"}
              </button>
            </div>

            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={clearAlert}
                className="mb-6"
              />
            )}

            <AuthForm
              authType={authType}
              userRole={userRole}
              onSubmit={handleSubmit}
              error={authError}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
