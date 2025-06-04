import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  IconButton,
} from "@mui/material";
import RoleSelection from "./RoleSelection";
import AuthForm from "./AuthForm";
import { authAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { validateForm, sanitizeInput, PASSWORD_REQUIREMENTS } from "../../utils/validation";

// Security constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const AuthPage = ({ onAuthSuccess }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State management
  const [authType, setAuthType] = useState("login");
  const [userRole, setUserRole] = useState(null);
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

  // Security and UI states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Check for existing lockout on mount
  useEffect(() => {
    const storedLockout = localStorage.getItem("authLockout");
    if (storedLockout) {
      const { timestamp, attempts } = JSON.parse(storedLockout);
      const now = Date.now();
      if (now - timestamp < LOCKOUT_DURATION) {
        setIsLocked(true);
        setLockoutTime(Math.ceil((LOCKOUT_DURATION - (now - timestamp)) / 1000));
        setLoginAttempts(attempts);
      } else {
        localStorage.removeItem("authLockout");
      }
    }
  }, []);

  // Update lockout timer
  useEffect(() => {
    let timer;
    if (isLocked && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem("authLockout");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  // Handle input changes with sanitization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = sanitizeInput(value, name);

    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setErrors({
        submit: `Account is locked. Please try again in ${Math.ceil(lockoutTime / 60)} minutes.`,
      });
      return;
    }

    const validationErrors = validateForm(formData, authType, userRole);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data for API call
      const apiData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: userRole,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        department: formData.department
      };

      // Add role-specific fields
      if (userRole === 'alumni') {
        Object.assign(apiData, {
          graduationYear: formData.graduationYear,
          currentJobTitle: formData.currentJobTitle,
          companyName: formData.companyName
        });
      } else if (userRole === 'faculty') {
        Object.assign(apiData, {
          designation: formData.designation
        });
      } else if (userRole === 'student') {
        Object.assign(apiData, {
          currentSemester: formData.currentSemester,
          rollNumber: formData.rollNumber
        });
      }

      const response = await authAPI[authType](apiData);

      if (response.success) {
        if (authType === "login") {
          // Reset login attempts on successful login
          setLoginAttempts(0);
          localStorage.removeItem("authLockout");

          // Store user role and handle navigation
          const userRole = response.data.role;
          localStorage.setItem("userRole", userRole);
          onAuthSuccess(userRole);
          navigate("/dashboard", { replace: true });
        } else {
          setAuthType("login");
          setFormData({ email: "", password: "" });
        }
      }
    } catch (error) {
      if (authType === "login") {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true);
          setLockoutTime(LOCKOUT_DURATION / 1000);
          localStorage.setItem(
            "authLockout",
            JSON.stringify({
              timestamp: Date.now(),
              attempts: newAttempts,
            })
          );
          setErrors({
            submit: `Too many failed attempts. Account locked for ${Math.ceil(
              LOCKOUT_DURATION / 60000
            )} minutes.`,
          });
        } else {
          setErrors({
            submit: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`,
          });
        }
      } else {
        setErrors({
          submit: error.message || `An error occurred during ${authType}. Please try again.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update form data when auth type changes
  useEffect(() => {
    setFormData({
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
    setErrors({});
  }, [authType]);

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        {!userRole ? (
          <RoleSelection 
            onSelect={(role) => setUserRole(role)} 
          />
        ) : (
          <>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton
                onClick={() => setUserRole(null)}
                sx={{ mr: 1 }}
                aria-label="back to role selection"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography component="h1" variant="h5">
                {authType === 'login' ? 'Sign In' : 'Sign Up'} as {userRole}
              </Typography>
            </Box>
            <AuthForm
              authType={authType}
              userRole={userRole}
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              isLocked={isLocked}
              passwordRequirements={PASSWORD_REQUIREMENTS}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleGoogleSignIn={() => {}}
            />
            {errors.submit && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {errors.submit}
              </Alert>
            )}
            {isLoading && (
              <CircularProgress sx={{ mt: 2 }} />
            )}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                {authType === "login" ? "Don't have an account? " : "Already have an account? "}
                <Typography
                  component="span"
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    setAuthType(authType === "login" ? "register" : "login");
                    setErrors({});
                  }}
                >
                  {authType === "login" ? "Sign Up" : "Sign In"}
                </Typography>
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage;
