import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { 
  FiMail, 
  FiTrash2, 
  FiUser, 
  FiCalendar, 
  FiMessageSquare, 
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiExternalLink
} from 'react-icons/fi';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const AdminContactMessages = memo(() => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all contact messages with useCallback for performance
  const fetchMessages = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = messages.length;
    const today = messages.filter(msg => {
      const msgDate = new Date(msg.createdAt);
      const today = new Date();
      return msgDate.toDateString() === today.toDateString();
    }).length;
    const thisWeek = messages.filter(msg => {
      const msgDate = new Date(msg.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return msgDate > weekAgo;
    }).length;
    return { total, today, thisWeek };
  }, [messages]);

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    return messages.filter(message =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FiMessageSquare className="h-7 w-7" />
              Contact Messages
            </h1>
            <p className="text-primary-100 mt-1">Manage and respond to user inquiries</p>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <FiRefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiMessageSquare className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-secondary-600">{stats.today}</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <FiClock className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600">{stats.thisWeek}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiFilter className="h-5 w-5" />
            Search & Filter
          </h3>
        </div>
        
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search messages by name, email, subject, or content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Messages Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading messages...</span>
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiMail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No messages found' : 'No messages yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Contact messages will appear here when users reach out'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMessages.map((message) => (
                <div key={message.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                  {/* Message Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FiUser className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                          <p className="text-sm text-gray-500">{message.email}</p>
                        </div>
                      </div>
                      <h4 className="text-base font-medium text-gray-800 mb-2 line-clamp-2">{message.subject}</h4>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="mb-4">
                    <p className="text-gray-600 leading-relaxed line-clamp-3">{message.message}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FiClock className="h-4 w-4" />
                    <span>{formatDate(message.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <FiEye className="h-4 w-4" />
                      View Details
                    </button>
                    
                    <a
                      href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-secondary-600 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                    >
                      <FiMail className="h-4 w-4" />
                      Reply
                    </a>
                    
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      disabled={deleteLoading === message.id}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === message.id ? (
                        <FiRefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <FiTrash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate mr-4 flex items-center gap-2">
                <FiMessageSquare className="h-5 w-5 text-primary-600" />
                Message Details
              </h3>
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
                        className="text-primary-600 hover:text-primary-800 transition-colors break-all"
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
                    className="flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
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
});

export default AdminContactMessages;
