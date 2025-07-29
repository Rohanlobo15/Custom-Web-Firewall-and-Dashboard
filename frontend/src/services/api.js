import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for larger datasets
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
      if (format === 'pdf') {
        // Handle PDF export client-side
        return await exportToPDF(filters);
      } else {
        // Handle other formats via API
        const response = await api.get('/securityevents/export', {
          params: { format, ...filters },
          responseType: 'blob'
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error exporting events:', error);
      throw error;
    }
  },

  // Get all events for PDF export
  getAllEventsForExport: async (filters = {}) => {
    try {
      const response = await api.get('/securityevents', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching events for export:', error);
      throw error;
    }
  }
};

// PDF Export function
const exportToPDF = async (filters = {}) => {
  try {
    // Get the data
    const events = await securityEventsAPI.getAllEventsForExport(filters);
    
    // Create HTML table for PDF-like export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Security Threats Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #ef4444; margin-bottom: 10px; }
          .header { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #ef4444; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .severity-critical { color: #dc2626; font-weight: bold; }
          .severity-high { color: #f59e0b; font-weight: bold; }
          .severity-medium { color: #3b82f6; font-weight: bold; }
          .severity-low { color: #10b981; font-weight: bold; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Security Threats Report</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Threats:</strong> ${events.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Event Type</th>
              <th>IP Address</th>
              <th>Endpoint</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Attack Pattern</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(event => `
              <tr>
                <td>${new Date(event.timestamp).toLocaleString()}</td>
                <td>${event.eventType || 'N/A'}</td>
                <td>${event.ipAddress || 'N/A'}</td>
                <td>${event.endpoint || 'N/A'}</td>
                <td class="severity-${event.severity?.toLowerCase() || 'low'}">${event.severity || 'N/A'}</td>
                <td>${event.blocked ? 'Blocked' : 'Detected'}</td>
                <td>${event.attackPattern || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <p>To save as PDF: Press Ctrl+P (or Cmd+P on Mac) and select "Save as PDF"</p>
        </div>
      </body>
      </html>
    `;
    
    // Create blob from HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return blob;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
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