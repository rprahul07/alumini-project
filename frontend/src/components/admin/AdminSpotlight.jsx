import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { 
  FiLoader, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiSearch, 
  FiStar, 
  FiExternalLink,
  FiRefreshCw,
  FiFilter,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiUser,
  FiCalendar
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { spotlightAPI } from '../../services/spotlightService';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../ConfirmDialog';

// Placeholder avatar for users without profile photos
const placeholderAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1IDQ1QzE1IDM3LjI2ODcgMjEuMjY4NyAzMSAzMCAzMUMzOC43MzEzIDMxIDQ1IDM3LjI2ODcgNDUgNDVWNDdIMTVWNDVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";

const AdminSpotlight = memo(() => {
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

  // Calculate stats
  const stats = useMemo(() => {
    const total = spotlights.length;
    const recent = spotlights.filter(spotlight => {
      const created = new Date(spotlight.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length;
    return { total, recent };
  }, [spotlights]);

  const fetchSpotlights = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSpotlights();
  }, [fetchSpotlights]);

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage spotlights.</p>
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
              <FiStar className="h-7 w-7" />
              Alumni Spotlight Management
            </h1>
            <p className="text-primary-100 mt-1">Manage featured alumni stories and achievements</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <FiPlus className="h-5 w-5" />
            Create Spotlight
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spotlights</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiStar className="h-6 w-6 text-primary-600" />
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
            onClick={fetchSpotlights}
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
            placeholder="Search spotlights by title, alumni name, or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Spotlights Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading.fetch ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading spotlights...</span>
            </div>
          </div>
        ) : filteredSpotlights.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiStar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No spotlights found' : 'No spotlights yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first alumni spotlight to showcase achievements'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpotlights.map((spotlight) => (
                <div key={spotlight.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                  {/* Spotlight Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={(spotlight.user?.photoUrl && spotlight.user.photoUrl.trim() !== '') 
                          ? spotlight.user.photoUrl 
                          : placeholderAvatar}
                        alt={spotlight.user?.fullName || 'Alumni'}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = placeholderAvatar;
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
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(spotlight)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                        title="Edit spotlight"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteSpotlightId(spotlight.id);
                          setShowDeleteDialog(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete spotlight"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Spotlight Content */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {spotlight.title}
                      </h4>
                      {spotlight.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {spotlight.description}
                        </p>
                      )}
                    </div>

                    {spotlight.user?.alumni?.currentJobTitle && (
                      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiUser className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Position:</span>
                        </div>
                        <p className="text-gray-800">
                          {spotlight.user.alumni.currentJobTitle}
                          {spotlight.user.alumni.companyName && (
                            <span className="text-gray-600"> at {spotlight.user.alumni.companyName}</span>
                          )}
                        </p>
                      </div>
                    )}

                    {spotlight.redirectionUrl && (
                      <div className="flex items-center text-sm text-primary-600 bg-primary-50 rounded-lg p-2">
                        <FiExternalLink className="h-4 w-4 mr-2" />
                        <span className="truncate">External Link Available</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiCalendar className="h-3 w-3" />
                      <span>Created: {new Date(spotlight.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiStar className="h-5 w-5 text-primary-600" />
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
                          src={(selectedAlumni.photoUrl && selectedAlumni.photoUrl.trim() !== '') 
                            ? selectedAlumni.photoUrl 
                            : placeholderAvatar}
                          alt={selectedAlumni.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => { e.target.src = placeholderAvatar; }}
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
                            src={(alumni.photoUrl && alumni.photoUrl.trim() !== '') 
                              ? alumni.photoUrl 
                              : placeholderAvatar}
                            alt={alumni.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.target.src = placeholderAvatar; }}
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
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
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
});

export default AdminSpotlight;
