import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  IdentificationIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserIcon,
  PencilSquareIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const ROLE_DISPLAY = {
  student: 'Student',
  alumni: 'Alumni',
  faculty: 'Faculty',
  admin: 'Administrator'
};

const InfoItem = ({ icon: Icon, text }) => (
  <div className="text-sm text-gray-700 flex items-center gap-1">
    <Icon className="h-4 w-4 text-indigo-500" />
    <span>{text}</span>
  </div>
);

const ProfileCard = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const getRoleDisplay = (role) => ROLE_DISPLAY[role] || role;

  const renderRoleSpecificInfo = () => {
    const commonInfo = user?.department && (
      <InfoItem icon={BuildingOfficeIcon} text={user.department} />
    );

    switch (user?.role) {
      case 'student':
        return (
          <>
            {user?.student?.rollNumber && (
              <InfoItem icon={IdentificationIcon} text={`Roll No: ${user.student.rollNumber}`} />
            )}
            {user?.student?.batch?.endYear && (
              <InfoItem icon={AcademicCapIcon} text={`Batch: ${user.student.batch.endYear}`} />
            )}
            {commonInfo}
          </>
        );
      case 'alumni':
        return (
          <>
            {user?.alumni?.currentJobTitle && user?.alumni?.currentCompany && (
              <InfoItem 
                icon={BriefcaseIcon} 
                text={`${user.alumni.currentJobTitle} at ${user.alumni.currentCompany}`} 
              />
            )}
            {user?.alumni?.graduationYear && (
              <InfoItem icon={AcademicCapIcon} text={`Graduated: ${user.alumni.graduationYear}`} />
            )}
            {commonInfo}
          </>
        );
      case 'faculty':
        return (
          <>
            {user?.faculty?.designation && (
              <InfoItem icon={UserIcon} text={user.faculty.designation} />
            )}
            {commonInfo}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center">
      {/* Profile Picture */}
      <img
        src={user?.profilePhoto || '/default-avatar.png'}
        alt="Profile"
        className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-sm mx-auto mb-2"
      />

      {/* User Details */}
      <h3 className="text-lg font-medium text-gray-800">{user?.fullName}</h3>
      <p className="text-sm text-indigo-600 font-medium">{getRoleDisplay(user?.userRole)}</p>

      {/* Social Icons */}
      <div className="flex justify-center gap-2 mt-2">
        {user?.linkedInProfile && (
          <a
            href={user.linkedInProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-indigo-600 text-lg cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        )}
        <a
          href={`mailto:${user?.email}`}
          className="text-gray-600 hover:text-indigo-600 text-lg cursor-pointer"
        >
          <EnvelopeIcon className="h-5 w-5" />
        </a>
      </div>

      {/* Divider */}
      <hr className="my-3 w-full border-gray-200" />

      {/* Academic Info */}
      <div className="w-full space-y-2">
        {renderRoleSpecificInfo()}
      </div>

      {/* Edit Button */}
      <Link
        to="/profile/edit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-4 text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
      >
        <PencilSquareIcon className="h-4 w-4" />
        Edit Profile
      </Link>
    </div>
  );
};

export default ProfileCard;
