import React from 'react';
import PasswordRequirements from './PasswordRequirements';
import GoogleAuthButton from './GoogleAuthButton';

const AuthForm = ({
  authType,
  userRole,
  formData,
  errors,
  isLoading,
  isLocked,
  passwordRequirements,
  handleInputChange,
  handleSubmit,
  handleGoogleSignIn,
  successMessage
}) => {
  if (!userRole) return null;

  return (
    <div className="auth-form">
      <h2>{authType === 'login' ? 'Login' : 'Register'} as {userRole}</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={errors.phoneNumber ? 'error' : ''}
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error">{errors.password}</span>}
          {authType === 'register' && (
            <PasswordRequirements passwordRequirements={passwordRequirements} />
          )}
        </div>

        {authType === 'register' && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
        )}

        {/* Role-specific Fields */}
        {authType === 'register' && (
          <>
            {userRole === 'alumni' && (
              <>
                <div className="form-group">
                  <label htmlFor="graduationYear">Graduation Year</label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    required
                    pattern="\d{4}"
                    maxLength={4}
                    className={errors.graduationYear ? 'error' : ''}
                  />
                  {errors.graduationYear && <span className="error">{errors.graduationYear}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department / Course</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={errors.department ? 'error' : ''}
                  />
                  {errors.department && <span className="error">{errors.department}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="currentJobTitle">Current Job Title</label>
                  <input
                    type="text"
                    id="currentJobTitle"
                    name="currentJobTitle"
                    value={formData.currentJobTitle}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={errors.currentJobTitle ? 'error' : ''}
                  />
                  {errors.currentJobTitle && <span className="error">{errors.currentJobTitle}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={errors.companyName ? 'error' : ''}
                  />
                  {errors.companyName && <span className="error">{errors.companyName}</span>}
                </div>
              </>
            )}

            {userRole === 'faculty' && (
              <>
                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={errors.designation ? 'error' : ''}
                  />
                  {errors.designation && <span className="error">{errors.designation}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={errors.department ? 'error' : ''}
                  />
                  {errors.department && <span className="error">{errors.department}</span>}
                </div>
              </>
            )}

            {userRole === 'student' && (
              <>
                <div className="form-group">
                  <label htmlFor="department">Course & Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={errors.department ? 'error' : ''}
                  />
                  {errors.department && <span className="error">{errors.department}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="currentSemester">Current Semester</label>
                  <input
                    type="text"
                    id="currentSemester"
                    name="currentSemester"
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                    required
                    maxLength={2}
                    className={errors.currentSemester ? 'error' : ''}
                  />
                  {errors.currentSemester && <span className="error">{errors.currentSemester}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number</label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className={errors.rollNumber ? 'error' : ''}
                  />
                  {errors.rollNumber && <span className="error">{errors.rollNumber}</span>}
                </div>
              </>
            )}
          </>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || isLocked}
        >
          {isLoading ? 'Processing...' : authType === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <GoogleAuthButton 
        onClick={handleGoogleSignIn} 
        disabled={isLoading || isLocked}
      >
        Continue with Google
      </GoogleAuthButton>
    </div>
  );
};

export default AuthForm; 