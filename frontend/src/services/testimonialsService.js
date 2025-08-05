import axios from '../config/axios';

/**
 * Testimonials API service for managing testimonials
 */
export const testimonialsAPI = {
  /**
   * Get all testimonials (Admin only)
   * @returns {Promise} Promise that resolves to testimonials data
   */
  getAll: async () => {
    try {
      const response = await axios.get('/api/testimonial/all');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch testimonials'
      };
    }
  },

  /**
   * Create a new testimonial (Admin only)
   * @param {Object} data - Testimonial data {userId, content}
   * @returns {Promise} Promise that resolves to created testimonial
   */
  create: async (data) => {
    try {
      const response = await axios.post('/api/testimonial/create', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create testimonial'
      };
    }
  },

  /**
   * Update a testimonial (Admin only)
   * @param {number} id - Testimonial ID
   * @param {Object} data - Updated data {content}
   * @returns {Promise} Promise that resolves to updated testimonial
   */
  update: async (id, data) => {
    try {
      const response = await axios.patch(`/api/testimonial/${id}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update testimonial'
      };
    }
  },

  /**
   * Delete a testimonial (Admin only)
   * @param {number} id - Testimonial ID
   * @returns {Promise} Promise that resolves to success message
   */
  delete: async (id) => {
    try {
      const response = await axios.delete(`/api/testimonial/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete testimonial'
      };
    }
  },

  /**
   * Get public testimonials (No auth required)
   * @returns {Promise} Promise that resolves to public testimonials
   */
  getPublic: async () => {
    try {
      const response = await axios.get('/api/public/testimonials');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching public testimonials:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch testimonials'
      };
    }
  }
};
