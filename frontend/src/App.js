import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ThreatChart from './components/ThreatChart';
import ThreatTable from './components/ThreatTable';
import SeverityDistribution from './components/SeverityDistribution';
import AttackPatternChart from './components/AttackPatternChart';

import { useSecurityEvents } from './hooks/useSecurityEvents';
import './App.css';

function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    severity: 'all',
    eventType: 'all',
    timeRange: '24h'
  });

  // Use the custom hook for security events
  const {
    events: threatData,
    loading,
    stats,
    updateEventStatus,
    exportEvents
  } = useSecurityEvents();

  useEffect(() => {
    // Apply filters
    let filtered = threatData || [];

    if (filters.severity !== 'all') {
      filtered = filtered.filter(threat => threat.severity === filters.severity);
    }

    if (filters.eventType !== 'all') {
      filtered = filtered.filter(threat => threat.eventType === filters.eventType);
    }

    // Time range filtering
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    if (filters.timeRange !== 'all') {
      const cutoffTime = now.getTime() - timeRanges[filters.timeRange];
      filtered = filtered.filter(threat => new Date(threat.timestamp).getTime() > cutoffTime);
    }

    setFilteredData(filtered);
  }, [threatData, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle export functionality
  const handleExport = () => {
    exportEvents('json', filters);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading Threat Analysis Dashboard...
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Header />
      
      <main className="dashboard-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="dashboard-content"
        >
          <StatsCards data={filteredData} stats={stats} />
          
          <div className="charts-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ThreatChart data={filteredData} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SeverityDistribution data={filteredData} />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AttackPatternChart data={filteredData} />
          </motion.div>
          
          <div className="bottom-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="table-container"
            >
              <ThreatTable 
                data={filteredData} 
                filters={filters}
                onFilterChange={handleFilterChange}
                onExport={handleExport}
                onUpdateStatus={updateEventStatus}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default App; 