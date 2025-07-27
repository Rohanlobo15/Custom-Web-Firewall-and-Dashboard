import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for security events
export const securityEventsAPI = {
  // Get all security events
  getAllEvents: async (filters = {}) => {
    try {
      const response = await api.get('/securityevents', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching security events:', error);
      // Return empty array if server is not available
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        console.log('Backend server not available, using fallback data');
        return [];
      }
      throw error;
    }
  },

  // Get events by severity
  getEventsBySeverity: async (severity) => {
    try {
      const response = await api.get(`/securityevents/severity/${severity}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events by severity:', error);
      throw error;
    }
  },

  // Get events by time range
  getEventsByTimeRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/securityevents/timerange', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events by time range:', error);
      throw error;
    }
  },

  // Get event statistics
  getEventStats: async () => {
    try {
      const response = await api.get('/securityevents/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching event statistics:', error);
      throw error;
    }
  },

  // Get attack pattern distribution
  getAttackPatterns: async () => {
    try {
      const response = await api.get('/securityevents/patterns');
      return response.data;
    } catch (error) {
      console.error('Error fetching attack patterns:', error);
      throw error;
    }
  },

  // Update event status (mark as processed)
  updateEventStatus: async (eventId, status) => {
    try {
      const response = await api.patch(`/securityevents/${eventId}`, { processed: status });
      return response.data;
    } catch (error) {
      console.error('Error updating event status:', error);
      throw error;
    }
  },

  // Export events
  exportEvents: async (format = 'json', filters = {}) => {
    try {
      const response = await api.get('/securityevents/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting events:', error);
      throw error;
    }
  }
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default api; 