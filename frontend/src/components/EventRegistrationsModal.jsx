import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, EnvelopeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import axios from '../config/axios';

const EventRegistrationsModal = ({ event, isOpen, onClose, user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const isAdmin = user?.role === 'admin';
  const isEventCreator = user?.id === event?.userId;

  useEffect(() => {
    if (isOpen && event) {
      fetchRegistrations();
    }
  }, [isOpen, event, currentPage]);

  const fetchRegistrations = async () => {
    if (!isAdmin && !isEventCreator) return; 
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/event/users/${event.id}?page=${currentPage}&limit=10`);
      
      if (response.data.success) {
        setRegistrations(response.data.data.registeredUsers);
        setSummary(response.data.data.summary);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleDetails = (user) => {
    if (!user.roleDetails) return '';
    
    switch (user.role) {
      case 'student':
        return `${user.roleDetails.rollNumber} • Semester ${user.roleDetails.currentSemester} • Batch ${user.roleDetails.graduationYear}`;
      case 'alumni':
        return `${user.roleDetails.course} • ${user.roleDetails.currentJobTitle} at ${user.roleDetails.companyName} • Batch ${user.roleDetails.graduationYear}`;
      case 'faculty':
        return user.roleDetails.designation;
      default:
        return '';
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Event Registrations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {event?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Summary */}
        {summary && Object.keys(summary).length > 0 && (
          <div className="bg-gray-50 px-3 py-2 border-b">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">{summary.totalRegistered}</span>
                <span className="text-gray-600 ml-1">registered</span>
              </div>
              {summary.availableSpots !== null && (
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">{summary.availableSpots}</span>
                  <span className="text-gray-600 ml-1">spots available</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-2" style={{ maxHeight: '50vh' }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading registrations...</span>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users registered for this event yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {registrations.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.fullName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-indigo-600" />
                        </div>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-medium text-gray-900 text-sm">{user.fullName}</h3>
                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800">
                          {formatRole(user.role)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mt-0.5">
                        <EnvelopeIcon className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      {user.roleDetails && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {getRoleDetails(user)}
                        </div>
                      )}
                      {user.department && (
                        <div className="text-xs text-gray-500">
                          Department: {user.department}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t bg-gray-50">
            <div className="text-xs text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.usersPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.usersPerPage, pagination.totalUsers)} of{' '}
              {pagination.totalUsers} users
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-2 py-0.5 text-xs border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="px-2 py-0.5 text-xs">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-2 py-0.5 text-xs border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationsModal; 