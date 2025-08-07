import React, { useState, useEffect } from 'react';
import { FiLoader, FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiStar, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { spotlightAPI } from '../../services/spotlightService';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../ConfirmDialog';

const AdminSpotlight = () => {
  const { isAdmin } = useAuth();
  
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState({
    fetch: true,
    create: false,
    update: false,
    delete: false,
    searchAlumni: false
  });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState(null);
  const [deleteSpotlightId, setDeleteSpotlightId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    redirectionUrl: '',
    userId: ''
  });

  // Alumni search states
  const [alumniSearchTerm, setAlumniSearchTerm] = useState('');
  const [alumniResults, setAlumniResults] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showAlumniSearch, setShowAlumniSearch] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSpotlights();
  }, []);

  const fetchSpotlights = async () => {
    setLoading(prev => ({ ...prev, fetch: true }));
    try {
      const result = await spotlightAPI.getAllSpotlights();
      if (result.success) {
        setSpotlights(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch spotlights');
    }
    setLoading(prev => ({ ...prev, fetch: false }));
  };

  const searchAlumni = async (searchValue) => {
    if (!searchValue.trim()) {
      setAlumniResults([]);
      return;
    }

    setLoading(prev => ({ ...prev, searchAlumni: true }));
    try {
      const result = await spotlightAPI.searchAlumniForSpotlight(searchValue, 10);
      if (result.success) {
        setAlumniResults(result.data);
      } else {
        toast.error(result.message);
        setAlumniResults([]);
      }
    } catch (error) {
      toast.error('Failed to search alumni');
      setAlumniResults([]);
    }
    setLoading(prev => ({ ...prev, searchAlumni: false }));
  };

  const handleAlumniSearch = (value) => {
    setAlumniSearchTerm(value);
    searchAlumni(value);
  };

  const handleAlumniSelect = (alumni) => {
    setSelectedAlumni(alumni);
    setFormData(prev => ({ ...prev, userId: alumni.userId }));
    setShowAlumniSearch(false);
    setAlumniSearchTerm(alumni.name);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      redirectionUrl: '',
      userId: ''
    });
    setSelectedAlumni(null);
    setAlumniSearchTerm('');
    setAlumniResults([]);
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
    setShowAlumniSearch(false);
  };

  const handleEdit = (spotlight) => {
    setEditingSpotlight(spotlight);
    setFormData({
      title: spotlight.title || '',
      description: spotlight.description || '',
      redirectionUrl: spotlight.redirectionUrl || '',
      userId: spotlight.userId || ''
    });
    
    // Set selected alumni for editing
    if (spotlight.user) {
      setSelectedAlumni({
        userId: spotlight.user.id,
        name: spotlight.user.fullName,
        photoUrl: spotlight.user.photoUrl,
        department: spotlight.user.department,
        graduationYear: spotlight.user.alumni?.graduationYear,
        currentJobTitle: spotlight.user.alumni?.currentJobTitle,
        companyName: spotlight.user.alumni?.companyName
      });
      setAlumniSearchTerm(spotlight.user.fullName);
    }
    
    setShowEditModal(true);
    setShowAlumniSearch(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.userId) {
      toast.error('Please select an alumni');
      return;
    }

    const isEditing = !!editingSpotlight;
    setLoading(prev => ({ ...prev, [isEditing ? 'update' : 'create']: true }));

    try {
      const result = isEditing 
        ? await spotlightAPI.updateSpotlight(editingSpotlight.id, formData)
        : await spotlightAPI.createSpotlight(formData);

      if (result.success) {
        toast.success(result.message);
        await fetchSpotlights();
        setShowCreateModal(false);
        setShowEditModal(false);
        resetForm();
        setEditingSpotlight(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} spotlight`);
    }
    
    setLoading(prev => ({ ...prev, [isEditing ? 'update' : 'create']: false }));
  };

  const handleDelete = async () => {
    if (!deleteSpotlightId) return;

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      const result = await spotlightAPI.deleteSpotlight(deleteSpotlightId);
      if (result.success) {
        toast.success(result.message);
        await fetchSpotlights();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete spotlight');
    }
    
    setLoading(prev => ({ ...prev, delete: false }));
    setShowDeleteDialog(false);
    setDeleteSpotlightId(null);
  };

  // Filter spotlights based on search term
  const filteredSpotlights = spotlights.filter(spotlight =>
    spotlight.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spotlight.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spotlight.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage spotlights.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiStar className="mr-3 text-yellow-500" />
            Alumni Spotlight Management
          </h2>
          <p className="text-gray-600 mt-1">Manage featured alumni stories and achievements</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <FiPlus className="mr-2" />
          Create Spotlight
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search spotlights by title, alumni name, or description..."
          className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Spotlights List */}
      {loading.fetch ? (
        <div className="text-center py-12">
          <FiLoader className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-600 mt-2">Loading spotlights...</p>
        </div>
      ) : filteredSpotlights.length === 0 ? (
        <div className="text-center py-12">
          <FiStar className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mt-4">
            {searchTerm ? 'No spotlights found' : 'No spotlights yet'}
          </h3>
          <p className="text-gray-600 mt-2">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first alumni spotlight to showcase achievements'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpotlights.map((spotlight) => (
            <div key={spotlight.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={spotlight.user?.photoUrl || '/default-avatar.png'}
                    alt={spotlight.user?.fullName || 'Alumni'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {spotlight.user?.fullName || 'Unknown Alumni'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {spotlight.user?.alumni?.graduationYear && `Class of ${spotlight.user.alumni.graduationYear}`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(spotlight)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Edit spotlight"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteSpotlightId(spotlight.id);
                      setShowDeleteDialog(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete spotlight"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 line-clamp-2">
                    {spotlight.title}
                  </h4>
                  {spotlight.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                      {spotlight.description}
                    </p>
                  )}
                </div>

                {spotlight.user?.alumni?.currentJobTitle && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Position:</span> {spotlight.user.alumni.currentJobTitle}
                    {spotlight.user.alumni.companyName && (
                      <span> at {spotlight.user.alumni.companyName}</span>
                    )}
                  </div>
                )}

                {spotlight.redirectionUrl && (
                  <div className="flex items-center text-sm text-indigo-600">
                    <FiExternalLink className="h-4 w-4 mr-1" />
                    <span className="truncate">External Link</span>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Created: {new Date(spotlight.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSpotlight ? 'Edit Spotlight' : 'Create New Spotlight'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                  setEditingSpotlight(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Alumni Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Alumni *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search alumni by name or company..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={alumniSearchTerm}
                    onChange={(e) => handleAlumniSearch(e.target.value)}
                    onFocus={() => setShowAlumniSearch(true)}
                  />
                  
                  {selectedAlumni && (
                    <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedAlumni.photoUrl || '/default-avatar.png'}
                          alt={selectedAlumni.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => { e.target.src = '/default-avatar.png'; }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{selectedAlumni.name}</p>
                          <p className="text-sm text-gray-600">
                            {selectedAlumni.currentJobTitle} 
                            {selectedAlumni.companyName && ` at ${selectedAlumni.companyName}`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAlumni(null);
                          setFormData(prev => ({ ...prev, userId: '' }));
                          setAlumniSearchTerm('');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Alumni Search Results */}
                  {showAlumniSearch && alumniResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {loading.searchAlumni && (
                        <div className="p-3 text-center text-gray-500">
                          <FiLoader className="mx-auto h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {alumniResults.map((alumni) => (
                        <button
                          key={alumni.userId}
                          type="button"
                          onClick={() => handleAlumniSelect(alumni)}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                        >
                          <img
                            src={alumni.photoUrl || '/default-avatar.png'}
                            alt={alumni.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.target.src = '/default-avatar.png'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{alumni.name}</p>
                            <p className="text-sm text-gray-600 truncate">
                              {alumni.currentJobTitle} 
                              {alumni.companyName && ` at ${alumni.companyName}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {alumni.department} • Class of {alumni.graduationYear}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spotlight Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Leading Innovation in AI Research"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the achievement, story, or accomplishment..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              {/* Redirection URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.redirectionUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, redirectionUrl: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Link to article, interview, or external content</p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                    setEditingSpotlight(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.create || loading.update || !formData.title.trim() || !formData.userId}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {(loading.create || loading.update) ? (
                    <>
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                      {editingSpotlight ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingSpotlight ? 'Update Spotlight' : 'Create Spotlight'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Spotlight"
        message="Are you sure you want to delete this spotlight? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeleteSpotlightId(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminSpotlight;
