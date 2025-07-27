import { useState, useEffect, useCallback } from 'react';
import { securityEventsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useSecurityEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    blocked: 0
  });

  // Fetch all security events
  const fetchEvents = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await securityEventsAPI.getAllEvents(filters);
      setEvents(Array.isArray(data) ? data : []);
      
      // Calculate stats
      const calculatedStats = {
        total: data.length,
        critical: data.filter(event => event.severity === 'CRITICAL').length,
        high: data.filter(event => event.severity === 'HIGH').length,
        medium: data.filter(event => event.severity === 'MEDIUM').length,
        low: data.filter(event => event.severity === 'LOW').length,
        blocked: data.filter(event => event.blocked).length
      };
      
      setStats(calculatedStats);
    } catch (err) {
      setError(err.message);
      if (err.code !== 'ERR_NETWORK' && err.code !== 'ERR_CONNECTION_REFUSED') {
        toast.error('Failed to fetch security events');
      }
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch events by severity
  const fetchEventsBySeverity = useCallback(async (severity) => {
    try {
      setLoading(true);
      const data = await securityEventsAPI.getEventsBySeverity(severity);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch ${severity} events`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch events by time range
  const fetchEventsByTimeRange = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      const data = await securityEventsAPI.getEventStats(startDate, endDate);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch events by time range');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event status
  const updateEventStatus = useCallback(async (eventId, status) => {
    try {
      await securityEventsAPI.updateEventStatus(eventId, status);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, processed: status }
            : event
        )
      );
      
      toast.success('Event status updated successfully');
    } catch (err) {
      toast.error('Failed to update event status');
      console.error('Error updating event status:', err);
    }
  }, []);

  // Export events
  const exportEvents = useCallback(async (format = 'json', filters = {}) => {
    try {
      const blob = await securityEventsAPI.exportEvents(format, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `security-events-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Events exported successfully');
    } catch (err) {
      toast.error('Failed to export events');
      console.error('Error exporting events:', err);
    }
  }, []);

  // Get attack patterns
  const getAttackPatterns = useCallback(async () => {
    try {
      const data = await securityEventsAPI.getAttackPatterns();
      return data;
    } catch (err) {
      console.error('Error fetching attack patterns:', err);
      return [];
    }
  }, []);

  // Get event statistics
  const getEventStats = useCallback(async () => {
    try {
      const data = await securityEventsAPI.getEventStats();
      return data;
    } catch (err) {
      console.error('Error fetching event stats:', err);
      return null;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    stats,
    fetchEvents,
    fetchEventsBySeverity,
    fetchEventsByTimeRange,
    updateEventStatus,
    exportEvents,
    getAttackPatterns,
    getEventStats
  };
}; 