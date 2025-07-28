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
      const response = await axios.get('/api/bookmarks');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      
      // If bookmark API doesn't exist (404), return empty data gracefully
      if (error.response?.status === 404) {
        console.warn('Bookmark API not found - feature may not be implemented yet');
        return {
          success: true,
          data: [],
          message: 'Bookmark feature not available'
        };
      }
      
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch bookmarks'
      };
    }
  },

  /**
   * Add an alumni to bookmarks
   * @param {number} alumniId - The alumni user ID to bookmark
   * @returns {Promise} Promise that resolves to the operation result
   */
  addBookmark: async (alumniId) => {
    try {
      const response = await axios.post('/api/bookmarks', { alumniId });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Alumni bookmarked successfully'
      };
    } catch (error) {
      console.error('Error adding bookmark:', error);
      
      // If bookmark API doesn't exist (404), return failure gracefully
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Bookmark feature not available'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bookmark alumni'
      };
    }
  },

  /**
   * Remove an alumni from bookmarks
   * @param {number} alumniId - The alumni user ID to remove from bookmarks
   * @returns {Promise} Promise that resolves to the operation result
   */
  removeBookmark: async (alumniId) => {
    try {
      const response = await axios.delete(`/api/bookmarks/${alumniId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Alumni removed from bookmarks'
      };
    } catch (error) {
      console.error('Error removing bookmark:', error);
      
      // If bookmark API doesn't exist (404), return failure gracefully
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Bookmark feature not available'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove bookmark'
      };
    }
  },

  /**
   * Toggle bookmark status for an alumni
   * @param {number} alumniId - The alumni user ID
   * @param {boolean} isCurrentlyBookmarked - Current bookmark status
   * @returns {Promise} Promise that resolves to the operation result
   */
  toggleBookmark: async (alumniId, isCurrentlyBookmarked) => {
    if (isCurrentlyBookmarked) {
      return await bookmarkAPI.removeBookmark(alumniId);
    } else {
      return await bookmarkAPI.addBookmark(alumniId);
    }
  }
};
