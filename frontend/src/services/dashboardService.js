import axios from '../config/axios';

/**
 * Dashboard API service for fetching platform statistics
 */
export const dashboardAPI = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Promise that resolves to dashboard stats
   */
  getStats: async () => {
    try {
      const response = await axios.get('/api/public/dashboard-stats');
      return {
        success: true,
        data: response.data.data || {},
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        data: {
          totalUsers: 0,
          totalAlumni: 0,
          totalStudents: 0,
          totalFaculty: 0,
          totalAdmins: 0,
          eventscount: 0
        },
        message: error.response?.data?.message || 'Failed to fetch dashboard stats'
      };
    }
  },

  /**
   * Format large numbers for display
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  formatNumber: (num) => {
    if (num === 0) {
      return '0';
    }
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K+';
    }
    return num + '+';
  }
};
