import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import GoogleAuthButton from './GoogleAuthButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AuthForm = ({
  authType,
  userRole,
  formData,
  errors,
  isLoading,
  isLocked,
  handleInputChange,
  handleSubmit,
  handleGoogleSignIn,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  if (!userRole) return null;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handlePhoneChange = (value) => {
    handleInputChange({
      target: {
        name: 'phoneNumber',
        value: `+${value}`
      }
    });
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        {authType === 'login' ? 'Sign In' : 'Create Account'}
      </Typography>

      {authType === 'register' && (
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName || ''}
          onChange={handleInputChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          margin="normal"
          required
        />
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={handleInputChange}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        required
      />

      {authType === 'register' && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <PhoneInput
            country={'in'}
            value={formData.phoneNumber?.replace('+', '')}
            onChange={handlePhoneChange}
            inputStyle={{
              width: '100%',
              height: '56px',
              fontSize: '16px',
              borderColor: errors.phoneNumber ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
            }}
            containerStyle={{
              width: '100%'
            }}
            inputProps={{
              id: 'phoneNumber',
              name: 'phoneNumber',
              required: true
            }}
          />
          {errors.phoneNumber && (
            <Typography color="error" variant="caption">
              {errors.phoneNumber}
            </Typography>
          )}
        </Box>
      )}

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password || ''}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {authType === 'register' && (
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword || ''}
          onChange={handleInputChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          margin="normal"
          required
        />
      )}

      {/* Role-specific Fields */}
      {authType === 'register' && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {userRole === 'alumni' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="graduationYear"
                  label="Graduation Year"
                  name="graduationYear"
                  value={formData.graduationYear || ''}
                  onChange={handleInputChange}
                  error={!!errors.graduationYear}
                  helperText={errors.graduationYear}
                  inputProps={{
                    pattern: "\\d{4}",
                    maxLength: 4
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="department"
                  label="Department / Course"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  error={!!errors.department}
                  helperText={errors.department}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="currentJobTitle"
                  label="Current Job Title"
                  name="currentJobTitle"
                  value={formData.currentJobTitle || ''}
                  onChange={handleInputChange}
                  error={!!errors.currentJobTitle}
                  helperText={errors.currentJobTitle}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="companyName"
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
            </>
          )}

          {userRole === 'faculty' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="designation"
                  label="Designation"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleInputChange}
                  error={!!errors.designation}
                  helperText={errors.designation}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="department"
                  label="Department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  error={!!errors.department}
                  helperText={errors.department}
                />
              </Grid>
            </>
          )}

          {userRole === 'student' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="department"
                  label="Department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  error={!!errors.department}
                  helperText={errors.department}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="currentSemester"
                  label="Current Semester"
                  name="currentSemester"
                  value={formData.currentSemester || ''}
                  onChange={handleInputChange}
                  error={!!errors.currentSemester}
                  helperText={errors.currentSemester}
                  inputProps={{
                    pattern: "[1-8]",
                    maxLength: 1
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="rollNumber"
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber || ''}
                  onChange={handleInputChange}
                  error={!!errors.rollNumber}
                  helperText={errors.rollNumber}
                />
              </Grid>
            </>
          )}
        </Grid>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isLocked}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : authType === 'login' ? (
            'Sign In'
          ) : (
            'Register'
          )}
        </Button>
      </Box>

      <GoogleAuthButton
        onClick={handleGoogleSignIn}
        disabled={isLoading || isLocked}
      />
    </Box>
  );
};

export default AuthForm; 