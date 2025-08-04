import React, { useState, useEffect } from 'react';
import { FiMail, FiTrash2, FiUser, FiCalendar, FiMessageSquare, FiEye } from 'react-icons/fi';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch all contact messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contactus');
      if (response.data.success) {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await axios.delete(`/api/contactus/${id}`);
      
      if (response.data.success) {
        setMessages(messages.filter(msg => msg.id !== id));
        toast.success('Message deleted successfully');
        
        // Close modal if the deleted message was being viewed
        if (selectedMessage && selectedMessage.id === id) {
          setShowModal(false);
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading contact messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600 mt-1">
            Manage and respond to user inquiries ({messages.length} messages)
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <FiMail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
          <p className="mt-1 text-sm text-gray-500">
            No contact messages have been received yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <FiUser className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{message.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FiMail className="h-4 w-4" />
                      <span>{message.email}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {message.subject}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4" />
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewMessage(message)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <FiEye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    disabled={deleteLoading === message.id}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === message.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                    ) : (
                      <FiTrash2 className="h-4 w-4 mr-1" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate mr-4">Message Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-bold flex-shrink-0"
              >
                ×
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900 font-semibold break-words">{selectedMessage.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors break-all"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg break-words">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received On
                  </label>
                  <p className="text-gray-600 text-sm sm:text-base">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  disabled={deleteLoading === selectedMessage.id}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === selectedMessage.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  ) : (
                    <FiTrash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Message
                </button>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <FiMail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                  
                  <button
                    onClick={closeModal}
                    className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
