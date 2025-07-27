import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Filter, Search, Download, Eye } from 'lucide-react';
import './ThreatTable.css';

const ThreatTable = ({ data, filters, onFilterChange, onExport, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter and sort data
  const filteredAndSortedData = data
    .filter(threat => {
      const searchLower = searchTerm.toLowerCase();
      return (
        threat.ipAddress.toLowerCase().includes(searchLower) ||
        threat.eventType.toLowerCase().includes(searchLower) ||
        threat.attackPattern.toLowerCase().includes(searchLower) ||
        threat.endpoint.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'CRITICAL': '#dc2626',
      'HIGH': '#f59e0b',
      'MEDIUM': '#3b82f6',
      'LOW': '#10b981'
    };
    return colors[severity] || '#6b7280';
  };

  const getStatusIcon = (blocked) => {
    return blocked ? '🛡️' : '⚠️';
  };

  return (
    <motion.div 
      className="table-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="table-header">
        <div className="table-title-section">
          <h3 className="table-title">Threat Details</h3>
          <p className="table-subtitle">Detailed view of all security events</p>
        </div>
        
        <div className="table-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search threats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select
              value={filters.severity}
              onChange={(e) => onFilterChange('severity', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          
          <button className="btn btn-secondary" onClick={onExport}>
            <Download className="btn-icon" />
            Export
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="threat-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('timestamp')} className="sortable">
                Time
                {sortField === 'timestamp' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('eventType')} className="sortable">
                Event Type
                {sortField === 'eventType' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>IP Address</th>
              <th>Endpoint</th>
              <th onClick={() => handleSort('severity')} className="sortable">
                Severity
                {sortField === 'severity' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((threat) => (
              <motion.tr
                key={threat._id}
                className="table-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <td className="timestamp-cell">
                  <div className="timestamp-info">
                    <span className="time">
                      {format(new Date(threat.timestamp), 'HH:mm:ss')}
                    </span>
                    <span className="date">
                      {format(new Date(threat.timestamp), 'MMM dd')}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="event-type">
                    <span className="event-name">{threat.eventType}</span>
                    <span className="event-pattern">{threat.attackPattern}</span>
                  </div>
                </td>
                <td>
                  <div className="ip-address">
                    <span className="ip">{threat.ipAddress}</span>
                    <span className="user-agent">{threat.userAgent}</span>
                  </div>
                </td>
                <td>
                  <div className="endpoint">
                    <span className="method">{threat.method}</span>
                    <span className="path">{threat.endpoint}</span>
                  </div>
                </td>
                <td>
                  <div 
                    className="severity-badge"
                    style={{ 
                      backgroundColor: `${getSeverityColor(threat.severity)}20`,
                      color: getSeverityColor(threat.severity),
                      borderColor: getSeverityColor(threat.severity)
                    }}
                  >
                    {threat.severity}
                  </div>
                </td>
                <td>
                  <div className="status-cell">
                    <span className="status-icon">{getStatusIcon(threat.blocked)}</span>
                    <span className="status-text">
                      {threat.blocked ? 'Blocked' : 'Detected'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <button 
                      className="action-btn" 
                      title="Mark as Processed"
                      onClick={() => onUpdateStatus(threat._id, !threat.processed)}
                    >
                      <Eye className="action-icon" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="table-info">
          Showing {filteredAndSortedData.length} of {data.length} threats
        </div>
        <div className="table-pagination">
          <button className="pagination-btn" disabled>Previous</button>
          <span className="page-info">Page 1 of 1</span>
          <button className="pagination-btn" disabled>Next</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatTable; 