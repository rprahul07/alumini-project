import axios from '../config/axios';

/**
 * Bookmark API service for managing alumni bookmarks
 */
export const bookmarkAPI = {
  /**
   * Get all bookmarked alumni for the current user
   * @returns {Promise} Promise that resolves to bookmarked alumni data
   */
  getBookmarks: async () => {
    try {
      const response = await axios.get('/api/bookmark/bookmark/get');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch bookmarks'
      };
    }
  },

  /**
   * Add an alumni to bookmarks
   * @param {number} alumniUserId - The alumni user ID (from User table)
   * @returns {Promise} Promise that resolves to the operation result
   */
  addBookmark: async (alumniUserId) => {
    try {
      const response = await axios.post(`/api/bookmark/bookmark/create/${alumniUserId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Alumni bookmarked successfully'
      };
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bookmark alumni'
      };
    }
  },

  /**
   * Remove an alumni from bookmarks
   * @param {number} alumniUserId - The alumni user ID (from User table)
   * @returns {Promise} Promise that resolves to the operation result
   */
  removeBookmark: async (alumniUserId) => {
    try {
      const response = await axios.delete(`/api/bookmark/bookmark/delete/${alumniUserId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Alumni removed from bookmarks'
      };
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove bookmark'
      };
    }
  },

  /**
   * Toggle bookmark status for an alumni
   * @param {number} alumniUserId - The alumni user ID (from User table)
   * @param {boolean} isCurrentlyBookmarked - Current bookmark status
   * @returns {Promise} Promise that resolves to the operation result
   */
  toggleBookmark: async (alumniUserId, isCurrentlyBookmarked) => {
    if (isCurrentlyBookmarked) {
      return await bookmarkAPI.removeBookmark(alumniUserId);
    } else {
      return await bookmarkAPI.addBookmark(alumniUserId);
    }
  }
};
