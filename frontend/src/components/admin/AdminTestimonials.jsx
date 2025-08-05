import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiUser, FiCalendar, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { testimonialsAPI } from '../../services/testimonialsService';
import axios from '../../config/axios';

const AdminTestimonials = () => {
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

  useEffect(() => {
    fetchTestimonials();
    fetchAlumni();
  }, []);

  const fetchTestimonials = async () => {
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
  };

  const fetchAlumni = async () => {
    try {
      const response = await axios.get('/api/alumni/getall');
      if (response.data?.data?.alumni) {
        setAlumni(response.data.data.alumni);
      }
    } catch (error) {
      console.error('Failed to fetch alumni:', error);
    }
  };

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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Alumni Testimonials</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <FiPlus className="h-5 w-5" />
          <span>Create Testimonial</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search testimonials..."
          className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading testimonials...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchTerm ? 'No testimonials found matching your search.' : 'No testimonials yet. Create your first testimonial!'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Alumni Photo */}
                  <div className="flex-shrink-0">
                    {testimonial.user?.photoUrl ? (
                      <img
                        src={testimonial.user.photoUrl}
                        alt={testimonial.user.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center ${testimonial.user?.photoUrl ? 'hidden' : 'flex'}`}
                    >
                      <FiUser className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonial.user?.fullName || 'Unknown Alumni'}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>{testimonial.user?.department || 'Unknown Department'}</span>
                        <span>•</span>
                        <span>Class of {testimonial.user?.alumni?.graduationYear || 'Unknown'}</span>
                      </div>
                      <div className="text-indigo-600 font-medium">
                        {testimonial.user?.alumni?.currentJobTitle || 'Unknown Position'} at {testimonial.user?.alumni?.companyName || 'Unknown Company'}
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                    <div className="flex items-center text-gray-500 text-xs mt-3">
                      <FiCalendar className="h-4 w-4 mr-1" />
                      <span>Created {new Date(testimonial.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(testimonial)}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit testimonial"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(testimonial.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete testimonial"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Testimonial</h3>
            
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
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createLoading || !selectedAlumniId || !testimonialContent.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Testimonial</h3>
            
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
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={updateLoading || !testimonialContent.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Testimonial</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteTestimonialId(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
};

export default AdminTestimonials;
