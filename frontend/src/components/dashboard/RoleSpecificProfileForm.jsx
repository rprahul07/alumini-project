// ✅ Cleaned & Optimized - Placeholder-safe
import React from 'react';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';

const RoleSpecificProfileForm = ({ role, formData, handleChange, setFormData }) => {
  const addPreviousRole = () => {
    if (formData.previousRoles.length < 3) {
      setFormData(prev => ({
        ...prev,
        previousRoles: [...prev.previousRoles, '']
      }));
    }
  };

  const removePreviousRole = (index) => {
    setFormData(prev => ({
      ...prev,
      previousRoles: prev.previousRoles.filter((_, i) => i !== index)
    }));
  };

  const addPreviousCompany = () => {
    setFormData(prev => ({
      ...prev,
      previousCompanies: [...prev.previousCompanies, '']
    }));
  };

  const removePreviousCompany = (index) => {
    setFormData(prev => ({
      ...prev,
      previousCompanies: prev.previousCompanies.filter((_, i) => i !== index)
    }));
  };

  if (role === 'student') {
    return (
      <div className="space-y-6">
        <InputField label="College Roll Number" id="collegeRollNumber" name="collegeRollNumber" value={formData.collegeRollNumber} onChange={handleChange} required />
        <InputField label="Batch Start Year" id="batch.startYear" name="batch.startYear" value={formData.batch.startYear} onChange={handleChange} type="number" required />
        <InputField label="Batch End Year" id="batch.endYear" name="batch.endYear" value={formData.batch.endYear} onChange={handleChange} type="number" required />
        <InputField label="Department" id="department" name="department" value={formData.department} onChange={handleChange} required />
        <InputField label="LinkedIn Profile" id="linkedInProfile" name="linkedInProfile" value={formData.linkedInProfile} onChange={handleChange} type="url" placeholder="https://linkedin.com/in/your-profile" />
      </div>
    );
  }

  if (role === 'alumni') {
    return (
      <div className="space-y-6">
        <InputField label="Graduation Year" id="graduationYear" name="graduationYear" value={formData.graduationYear} onChange={handleChange} type="number" required />
        <InputField label="Department" id="department" name="department" value={formData.department} onChange={handleChange} required />
        <InputField label="Current Job Title" id="currentJobTitle" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange} required />
        <InputField label="Current Company" id="currentCompany" name="currentCompany" value={formData.currentCompany} onChange={handleChange} required />
        {/* Previous Roles */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Previous Roles (Max 3)</label>
            {formData.previousRoles.length < 3 && (
              <button type="button" onClick={addPreviousRole} className="text-[#4F46E5] hover:text-[#4338CA] text-sm font-medium">
                <FiPlusCircle className="inline mr-1" />Add Role
              </button>
            )}
          </div>
          {formData.previousRoles.map((role, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input type="text" value={role} onChange={e => {
                const newRoles = [...formData.previousRoles];
                newRoles[index] = e.target.value;
                setFormData(prev => ({ ...prev, previousRoles: newRoles }));
              }} placeholder="Previous Role" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent" />
              <button type="button" onClick={() => removePreviousRole(index)} className="text-red-500 hover:text-red-600"><FiTrash2 /></button>
            </div>
          ))}
        </div>
        {/* Previous Companies */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Previous Companies</label>
            <button type="button" onClick={addPreviousCompany} className="text-[#4F46E5] hover:text-[#4338CA] text-sm font-medium">
              <FiPlusCircle className="inline mr-1" />Add Company
            </button>
          </div>
          {formData.previousCompanies.map((company, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input type="text" value={company} onChange={e => {
                const newCompanies = [...formData.previousCompanies];
                newCompanies[index] = e.target.value;
                setFormData(prev => ({ ...prev, previousCompanies: newCompanies }));
              }} placeholder="Previous Company" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent" />
              <button type="button" onClick={() => removePreviousCompany(index)} className="text-red-500 hover:text-red-600"><FiTrash2 /></button>
            </div>
          ))}
        </div>
        <InputField label="LinkedIn Profile" id="linkedInProfile" name="linkedInProfile" value={formData.linkedInProfile} onChange={handleChange} type="url" placeholder="https://linkedin.com/in/your-profile" />
      </div>
    );
  }

  if (role === 'faculty') {
    return (
      <div className="space-y-6">
        <InputField label="Department" id="department" name="department" value={formData.department} onChange={handleChange} required />
        <InputField label="Designation" id="designation" name="designation" value={formData.designation} onChange={handleChange} required />
      </div>
    );
  }

  return null;
};

const InputField = ({ label, id, name, value, onChange, type = 'text', required = false, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default RoleSpecificProfileForm; 