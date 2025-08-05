import axios from '../config/axios';

/**
 * Announcement API service for managing announcements
 */
export const announcementAPI = {
  /**
   * Get all announcements (public endpoint)
   * @returns {Promise} Promise that resolves to announcements data
   */
  getAllAnnouncements: async () => {
    try {
      const response = await axios.get('/api/announcements');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch announcements'
      };
    }
  },

  /**
   * Create a new announcement (admin only)
   * @param {Object} announcementData - The announcement data
   * @returns {Promise} Promise that resolves to creation result
   */
  createAnnouncement: async (announcementData) => {
    try {
      const response = await axios.post('/api/announcements', announcementData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Announcement created successfully'
      };
    } catch (error) {
      console.error('Error creating announcement:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create announcement'
      };
    }
  },

  /**
   * Update an existing announcement (admin only)
   * @param {number} id - The announcement ID
   * @param {Object} announcementData - The updated announcement data
   * @returns {Promise} Promise that resolves to update result
   */
  updateAnnouncement: async (id, announcementData) => {
    try {
      const response = await axios.put(`/api/announcements/${id}`, announcementData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Announcement updated successfully'
      };
    } catch (error) {
      console.error('Error updating announcement:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update announcement'
      };
    }
  },

  /**
   * Delete an announcement (admin only)
   * @param {number} id - The announcement ID
   * @returns {Promise} Promise that resolves to deletion result
   */
  deleteAnnouncement: async (id) => {
    try {
      const response = await axios.delete(`/api/announcements/${id}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'Announcement deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to delete announcement'
      };
    }
  }
};
