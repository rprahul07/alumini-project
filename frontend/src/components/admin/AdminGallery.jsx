import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { 
  FiLoader, 
  FiUpload, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiImage,
  FiRefreshCw,
  FiFilter,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiSearch
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { galleryAPI } from '../../services/galleryService';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../ConfirmDialog';

const AdminGallery = memo(() => {
  const { canManageGallery, isAdmin, user, role } = useAuth();
  
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState({
    fetch: true,
    create: false,
    update: false,
    delete: false
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Calculate stats
  const stats = useMemo(() => {
    const total = gallery.length;
    const recent = gallery.filter(item => {
      const created = new Date(item.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length;
    return { total, recent };
  }, [gallery]);

  // Filter gallery based on search
  const filteredGallery = useMemo(() => {
    if (!searchTerm.trim()) return gallery;
    return gallery.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [gallery, searchTerm]);

  const fetchGallery = useCallback(async () => {
    setLoading(prev => ({ ...prev, fetch: true }));
    try {
      const result = await galleryAPI.getGallery();
      if (result.success) {
        setGallery(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch gallery');
    }
    setLoading(prev => ({ ...prev, fetch: false }));
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleFileSelect = (file) => {
    if (file) {
      // Check file size (10MB limit for images only)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Check file type - images only
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file');
        return;
      }
    }
    
    setSelectedFile(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setSelectedFile(null);
    setPreview(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    setLoading(prev => ({ ...prev, create: true }));
    setUploadProgress(0);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('photo', selectedFile);

      // Show file size info for large files
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > 10) {
        toast.info(`Uploading large file (${fileSizeMB.toFixed(1)}MB). This may take a moment...`);
      }

      const result = await galleryAPI.createGallery(formDataToSend);
      
      if (result.success) {
        toast.success('Gallery item created successfully');
        setGallery(prev => [result.data, ...prev]);
        setShowUploadModal(false);
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Create error:', error);
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        toast.error('Upload failed: Network connection issue. Please check your internet connection and try again.');
      } else if (error.message.includes('timeout')) {
        toast.error('Upload timeout: File too large or connection too slow. Please try a smaller file.');
      } else {
        toast.error('Failed to create gallery item: ' + (error.response?.data?.message || error.message));
      }
    }
    
    setLoading(prev => ({ ...prev, create: false }));
    setUploadProgress(0);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(prev => ({ ...prev, update: true }));
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      if (selectedFile) {
        formDataToSend.append('photo', selectedFile);
        
        // Show file size info for large files
        const fileSizeMB = selectedFile.size / (1024 * 1024);
        if (fileSizeMB > 10) {
          toast.info(`Uploading large file (${fileSizeMB.toFixed(1)}MB). This may take a moment...`);
        }
      }

      const result = await galleryAPI.updateGallery(editingItem.id, formDataToSend);
      
      if (result.success) {
        toast.success('Gallery item updated successfully');
        setGallery(prev => prev.map(item => 
          item.id === editingItem.id ? result.data : item
        ));
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        toast.error('Update failed: Network connection issue. Please check your internet connection and try again.');
      } else if (error.message.includes('timeout')) {
        toast.error('Update timeout: File too large or connection too slow. Please try a smaller file.');
      } else {
        toast.error('Failed to update gallery item: ' + (error.response?.data?.message || error.message));
      }
    }
    
    setLoading(prev => ({ ...prev, update: false }));
  };

  const handleDelete = async () => {
    setLoading(prev => ({ ...prev, delete: true }));
    
    try {
      const result = await galleryAPI.deleteGallery(deleteItemId);
      
      if (result.success) {
        toast.success('Gallery item deleted successfully');
        setGallery(prev => prev.filter(item => item.id !== deleteItemId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
    
    setLoading(prev => ({ ...prev, delete: false }));
    setShowDeleteDialog(false);
    setDeleteItemId(null);
  };

  const openDeleteDialog = (id) => {
    setDeleteItemId(id);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteItemId(null);
    setShowDeleteDialog(false);
  };

  // Check if user has permission to manage gallery
  if (!canManageGallery()) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <FiImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage gallery items.</p>
        <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded">
          <strong>Debug Info:</strong><br/>
          User Role: {role || 'null'}<br/>
          User Object: {user ? JSON.stringify(user, null, 2) : 'null'}<br/>
          Is Admin: {isAdmin() ? 'true' : 'false'}<br/>
          Can Manage Gallery: {canManageGallery() ? 'true' : 'false'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FiImage className="h-7 w-7" />
              Gallery Management
            </h1>
            <p className="text-primary-100 mt-1">Manage campus photos and media</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <FiPlus className="h-5 w-5" />
            Add Media
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiImage className="h-6 w-6 text-primary-600" />
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
            onClick={fetchGallery}
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
            placeholder="Search gallery by title or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading.fetch ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
              ))}
            </div>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No gallery items found' : 'No gallery items yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Start building your gallery by adding some photos'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div key={item.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                  {/* Image Preview */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex space-x-1 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                        title="Edit gallery item"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openDeleteDialog(item.id);
                        }}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                        title="Delete gallery item"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiClock className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiImage className="h-6 w-6 text-primary-600" />
                Add New Gallery Item
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {preview ? (
                      <div className="space-y-4">
                        <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                        <p className="text-sm text-gray-600">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload image</p>
                        <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, WebP, GIF (Max: 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading.create}
                className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                {loading.create ? (
                  <>
                    <FiLoader className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Gallery Item</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiImage className="h-6 w-6 text-primary-600" />
                Edit Gallery Item
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Current Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <div className="border rounded-xl p-4">
                  <img src={editingItem.imageUrl} alt={editingItem.title} className="w-full max-h-32 object-cover rounded-lg" />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="file-upload-edit"
                  />
                  <label htmlFor="file-upload-edit" className="cursor-pointer">
                    {preview ? (
                      <div className="space-y-4">
                        <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                        <p className="text-sm text-gray-600">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload new file</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading.update}
                className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                {loading.update ? (
                  <>
                    <FiLoader className="h-5 w-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Gallery Item</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery item? This action cannot be undone."
      />
    </div>
  );
});

export default AdminGallery;
