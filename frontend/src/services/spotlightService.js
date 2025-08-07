import axios from '../config/axios';

const API_BASE = '/api/spotlight';
const ALUMNI_API_BASE = '/api/alumni';

export const spotlightAPI = {
  // Get all spotlights (public)
  getAllSpotlights: async () => {
    try {
      const response = await axios.get(API_BASE);
      return {
        success: true,
        data: response.data.data || [],
        message: 'Spotlights fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching spotlights:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch spotlights',
        data: []
      };
    }
  },

  // Get spotlight by ID (public)
  getSpotlightById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Spotlight fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching spotlight:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch spotlight',
        data: null
      };
    }
  },

  // Create new spotlight (admin only)
  createSpotlight: async (spotlightData) => {
    try {
      const response = await axios.post(API_BASE, spotlightData);
      return {
        success: true,
        data: response.data.data,
        message: 'Spotlight created successfully'
      };
    } catch (error) {
      console.error('Error creating spotlight:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to create spotlight',
        data: null
      };
    }
  },

  // Update spotlight (admin only)
  updateSpotlight: async (id, spotlightData) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, spotlightData);
      return {
        success: true,
        data: response.data.data,
        message: 'Spotlight updated successfully'
      };
    } catch (error) {
      console.error('Error updating spotlight:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update spotlight',
        data: null
      };
    }
  },

  // Delete spotlight (admin only)
  deleteSpotlight: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/${id}`);
      return {
        success: true,
        data: null,
        message: 'Spotlight deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting spotlight:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to delete spotlight',
        data: null
      };
    }
  },

  // Search alumni for spotlight creation (admin only)
  searchAlumniForSpotlight: async (searchTerm = '', limit = 10) => {
    try {
      const params = {};
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (limit) {
        params.limit = limit;
      }

      const response = await axios.get(`${ALUMNI_API_BASE}/search-for-spotlight`, { params });
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Alumni search completed'
      };
    } catch (error) {
      console.error('Error searching alumni:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to search alumni',
        data: []
      };
    }
  }
};

export default spotlightAPI;
