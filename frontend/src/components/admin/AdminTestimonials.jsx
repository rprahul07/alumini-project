import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiUser, 
  FiCalendar, 
  FiLoader,
  FiRefreshCw,
  FiFilter,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiMessageSquare,
  FiStar
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { testimonialsAPI } from '../../services/testimonialsService';
import axios from '../../config/axios';

const AdminTestimonials = memo(() => {
  const [testimonials, setTestimonials] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTestimonialId, setDeleteTestimonialId] = useState(null);

  // Loading states for different operations
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [selectedAlumniId, setSelectedAlumniId] = useState('');
  const [testimonialContent, setTestimonialContent] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const total = testimonials.length;
    const recent = testimonials.filter(testimonial => {
      const created = new Date(testimonial.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length;
    return { total, recent };
  }, [testimonials]);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const result = await testimonialsAPI.getAll();
      if (result.success) {
        setTestimonials(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlumni = useCallback(async () => {
    try {
      const response = await axios.get('/api/alumni/getall');
      if (response.data?.data?.alumni) {
        setAlumni(response.data.data.alumni);
      }
    } catch (error) {
      console.error('Failed to fetch alumni:', error);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
    fetchAlumni();
  }, [fetchTestimonials, fetchAlumni]);

  const handleCreate = async () => {
    if (!selectedAlumniId || !testimonialContent.trim()) {
      toast.error('Please select an alumni and enter testimonial content');
      return;
    }

    setCreateLoading(true);
    try {
      const result = await testimonialsAPI.create({
        userId: parseInt(selectedAlumniId),
        content: testimonialContent.trim()
      });

      if (result.success) {
        toast.success('Testimonial created successfully');
        setShowCreateModal(false);
        setSelectedAlumniId('');
        setTestimonialContent('');
        fetchTestimonials();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create testimonial');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!testimonialContent.trim()) {
      toast.error('Please enter testimonial content');
      return;
    }

    setUpdateLoading(true);
    try {
      const result = await testimonialsAPI.update(editingTestimonial.id, {
        content: testimonialContent.trim()
      });

      if (result.success) {
        toast.success('Testimonial updated successfully');
        setShowEditModal(false);
        setEditingTestimonial(null);
        setTestimonialContent('');
        fetchTestimonials();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update testimonial');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTestimonialId) return;

    setDeleteLoading(true);
    try {
      const result = await testimonialsAPI.delete(deleteTestimonialId);
      if (result.success) {
        toast.success('Testimonial deleted successfully');
        setShowDeleteDialog(false);
        setDeleteTestimonialId(null);
        fetchTestimonials();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialContent(testimonial.content);
    setShowEditModal(true);
  };

  const openDeleteDialog = (id) => {
    setDeleteTestimonialId(id);
    setShowDeleteDialog(true);
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FiMessageSquare className="h-7 w-7" />
              Alumni Testimonials
            </h1>
            <p className="text-primary-100 mt-1">Manage alumni testimonials and reviews</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <FiPlus className="h-5 w-5" />
            Create Testimonial
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
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
            onClick={fetchTestimonials}
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
            placeholder="Search testimonials by alumni name or content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading testimonials...</span>
            </div>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiMessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No testimonials found' : 'No testimonials yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first testimonial to showcase alumni experiences'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                  {/* Testimonial Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {testimonial.user?.photoUrl ? (
                        <img
                          src={testimonial.user.photoUrl}
                          alt={testimonial.user.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center ${testimonial.user?.photoUrl ? 'hidden' : 'flex'}`}
                      >
                        <FiUser className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {testimonial.user?.fullName || 'Unknown Alumni'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.user?.department || 'Unknown Department'} • Class of {testimonial.user?.alumni?.graduationYear || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(testimonial)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                        title="Edit testimonial"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(testimonial.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete testimonial"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Alumni Position */}
                  {testimonial.user?.alumni?.currentJobTitle && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiStar className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Current Position:</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {testimonial.user.alumni.currentJobTitle}
                        {testimonial.user.alumni.companyName && (
                          <span className="text-gray-600"> at {testimonial.user.alumni.companyName}</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Testimonial Content */}
                  <div className="mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4" />
                    <span>Created {new Date(testimonial.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiMessageSquare className="h-5 w-5 text-primary-600" />
              Create New Testimonial
            </h3>
            
            {/* Alumni Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Alumni
              </label>
              <select
                value={selectedAlumniId}
                onChange={(e) => setSelectedAlumniId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose an alumni...</option>
                {alumni.map((alum) => (
                  <option key={alum.userId} value={alum.userId}>
                    {alum.fullName} - {alum.department} (Class of {alum.alumni?.graduationYear})
                  </option>
                ))}
              </select>
            </div>

            {/* Testimonial Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Content
              </label>
              <textarea
                value={testimonialContent}
                onChange={(e) => setTestimonialContent(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Enter the testimonial content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {testimonialContent.length}/1000 characters
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedAlumniId('');
                  setTestimonialContent('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createLoading || !selectedAlumniId || !testimonialContent.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              >
                {createLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                <span>{createLoading ? 'Creating...' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiMessageSquare className="h-5 w-5 text-primary-600" />
              Edit Testimonial
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Editing testimonial for: <span className="font-semibold">{editingTestimonial?.user?.fullName}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Content
              </label>
              <textarea
                value={testimonialContent}
                onChange={(e) => setTestimonialContent(e.target.value)}
                rows={4}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {testimonialContent.length}/1000 characters
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTestimonial(null);
                  setTestimonialContent('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={updateLoading || !testimonialContent.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              >
                {updateLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                <span>{updateLoading ? 'Updating...' : 'Update'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Testimonial</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteTestimonialId(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              >
                {deleteLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminTestimonials;
