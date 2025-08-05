import axios from '../config/axios';

/**
 * Gallery API service for managing gallery items
 */
export const galleryAPI = {
  /**
   * Get all gallery items (public endpoint)
   * @returns {Promise} Promise that resolves to gallery data
   */
  getGallery: async () => {
    try {
      const response = await axios.get('/api/public/gallery');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch gallery'
      };
    }
  },

  /**
   * Create a new gallery item (admin only)
   * @param {FormData} formData - Form data containing file and gallery details
   * @returns {Promise} Promise that resolves to created gallery item
   */
  createGallery: async (formData) => {
    try {
      const response = await axios.post('/api/gallery', formData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating gallery item:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create gallery item'
      };
    }
  },

  /**
   * Update a gallery item (admin only)
   * @param {number} id - Gallery item ID
   * @param {FormData} formData - Form data containing updated details
   * @returns {Promise} Promise that resolves to updated gallery item
   */
  updateGallery: async (id, formData) => {
    try {
      const response = await axios.put(`/api/gallery/${id}`, formData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update gallery item'
      };
    }
  },

  /**
   * Delete a gallery item (admin only)
   * @param {number} id - Gallery item ID
   * @returns {Promise} Promise that resolves to deletion confirmation
   */
  deleteGallery: async (id) => {
    try {
      const response = await axios.delete(`/api/gallery/${id}`);
      return {
        success: true,
        data: null,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to delete gallery item'
      };
    }
  }
};

export default galleryAPI;
