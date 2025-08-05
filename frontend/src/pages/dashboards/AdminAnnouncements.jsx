import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { announcementAPI } from '../../services/announcementService';
import { FiPlus, FiEdit2, FiTrash2, FiBell, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 0
  });

  // Fetch announcements
  const fetchAnnouncements = async () => {
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
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Announcements</h1>
          <p className="text-gray-600 mt-2">Create and manage announcements for the homepage</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <FiPlus className="h-5 w-5" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading && !showModal ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <FiBell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first announcement</p>
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Announcement
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement, index) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        Order: {announcement.order}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {announcement.content}
                    </p>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                      {announcement.updatedAt !== announcement.createdAt && (
                        <span> • Updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Order controls */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveAnnouncement(announcement, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <FiChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveAnnouncement(announcement, 'down')}
                        disabled={index === announcements.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <FiChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Edit button */}
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => setConfirmDelete(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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
};

export default AdminAnnouncements;
