import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { announcementAPI } from '../../services/announcementService';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiBell, 
  FiChevronUp, 
  FiChevronDown,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';

const AdminAnnouncements = memo(() => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 0
  });

  // Fetch announcements with useCallback for performance
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const result = await announcementAPI.getAllAnnouncements();
      if (result.success) {
        setAnnouncements(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = announcements.length;
    const recent = announcements.filter(a => {
      const created = new Date(a.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length;
    return { total, recent };
  }, [announcements]);

  // Filter announcements based on search
  const filteredAnnouncements = useMemo(() => {
    if (!searchTerm.trim()) return announcements;
    return announcements.filter(announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [announcements, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = editingAnnouncement
        ? await announcementAPI.updateAnnouncement(editingAnnouncement.id, formData)
        : await announcementAPI.createAnnouncement(formData);

      if (result.success) {
        toast.success(result.message);
        setShowModal(false);
        setEditingAnnouncement(null);
        setFormData({ title: '', content: '', order: 0 });
        fetchAnnouncements();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const result = await announcementAPI.deleteAnnouncement(id);
      if (result.success) {
        toast.success(result.message);
        fetchAnnouncements();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete announcement');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  // Open edit modal
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      order: announcement.order
    });
    setShowModal(true);
  };

  // Open create modal
  const handleCreate = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', order: 0 });
    setShowModal(true);
  };

  // Move announcement up/down
  const moveAnnouncement = async (announcement, direction) => {
    const newOrder = direction === 'up' ? announcement.order - 1 : announcement.order + 1;
    const result = await announcementAPI.updateAnnouncement(announcement.id, {
      ...announcement,
      order: newOrder
    });
    
    if (result.success) {
      fetchAnnouncements();
    } else {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FiBell className="h-7 w-7" />
              Announcement Management
            </h1>
            <p className="text-primary-100 mt-1">Create and manage announcements for the homepage</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <FiPlus className="h-5 w-5" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiBell className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
              <p className="text-2xl font-bold text-secondary-600">{stats.recent}</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-secondary-600" />
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
          <button
            onClick={fetchAnnouncements}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search announcements by title or content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading announcements...</span>
            </div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiBell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No announcements found' : 'No announcements yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first announcement to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAnnouncements.map((announcement, index) => (
                <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                  {/* Announcement Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{announcement.title}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                        <FiCalendar className="h-3 w-3" />
                        Order: {announcement.order}
                      </span>
                    </div>
                  </div>

                  {/* Announcement Content */}
                  <div className="mb-4">
                    <p className="text-gray-600 leading-relaxed line-clamp-3">{announcement.content}</p>
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock className="h-4 w-4" />
                      <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    {announcement.updatedAt !== announcement.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiEdit2 className="h-4 w-4" />
                        <span>Updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => moveAnnouncement(announcement, 'up')}
                      disabled={index === 0}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <FiChevronUp className="h-4 w-4" />
                      Up
                    </button>
                    
                    <button
                      onClick={() => moveAnnouncement(announcement, 'down')}
                      disabled={index === filteredAnnouncements.length - 1}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <FiChevronDown className="h-4 w-4" />
                      Down
                    </button>
                    
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <FiEdit2 className="h-4 w-4" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => setConfirmDelete(announcement.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FiBell className="h-6 w-6 text-primary-600" />
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter announcement title"
                  maxLength={200}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/200 characters
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  placeholder="Enter announcement content"
                  maxLength={1000}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {formData.content.length}/1000 characters
                </div>
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  id="order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="0"
                  min="0"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Lower numbers appear first (0 = highest priority)
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAnnouncement(null);
                    setFormData({ title: '', content: '', order: 0 });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiAlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Delete
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminAnnouncements;
