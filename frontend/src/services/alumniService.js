import axios from '../config/axios';

/**
 * Alumni API service for fetching alumni data
 */
export const alumniAPI = {
  /**
   * Get newly joined alumni (latest 10)
   * @returns {Promise} Promise that resolves to newly joined alumni data
   */
  getNewlyJoined: async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', 10);
      params.append('offset', 0);
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');
      
      const response = await axios.get(`/api/alumni/searchalumni?${params}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data?.profiles || [],
          message: 'Newly joined alumni fetched successfully'
        };
      } else {
        console.error('API returned error:', response.data);
        return {
          success: false,
          data: [],
          message: response.data.message || 'API returned an error'
        };
      }
    } catch (error) {
      console.error('Error fetching newly joined alumni:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch newly joined alumni'
      };
    }
  },

  /**
   * Search alumni with filters
   * @param {Object} filters - Search filters
   * @returns {Promise} Promise that resolves to alumni search results
   */
  searchAlumni: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', filters.limit || 12);
      params.append('offset', filters.offset || 0);
      params.append('sortBy', filters.sortBy || 'createdAt');
      params.append('sortOrder', filters.sortOrder || 'desc');
      
      if (filters.search) params.append('search', filters.search);
      if (filters.graduationYear) params.append('graduationYear', filters.graduationYear);
      if (filters.company) params.append('company', filters.company);
      if (filters.role) params.append('role', filters.role);
      
      const response = await axios.get(`/api/alumni/searchalumni?${params}`);
      return {
        success: true,
        data: response.data.data || {},
        message: 'Alumni search completed successfully'
      };
    } catch (error) {
      console.error('Error searching alumni:', error);
      return {
        success: false,
        data: { profiles: [], pagination: { totalPages: 0 } },
        message: error.response?.data?.error || 'Failed to search alumni'
      };
    }
  }
};

export default alumniAPI;
