import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import './SeverityDistribution.css';

const SeverityDistribution = ({ data }) => {
  // Process data for pie chart
  const processSeverityData = () => {
    const severityCounts = {};
    
    data.forEach(threat => {
      const severity = threat.severity;
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;
    });

    const colors = {
      'CRITICAL': '#dc2626',
      'HIGH': '#f59e0b',
      'MEDIUM': '#3b82f6',
      'LOW': '#10b981'
    };

    return Object.entries(severityCounts).map(([severity, count]) => ({
      name: severity,
      value: count,
      color: colors[severity] || '#6b7280'
    }));
  };

  const chartData = processSeverityData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Severity: ${data.name}`}</p>
          <p className="tooltip-value">{`Count: ${data.value}`}</p>
          <p className="tooltip-percentage">{`${((data.value / data.length) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="custom-legend">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="legend-item">
          <div 
            className="legend-color" 
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="legend-text">{entry.value}</span>
          <span className="legend-count">
            {chartData.find(d => d.name === entry.value)?.value || 0}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="chart-header">
        <div className="chart-title-section">
          <PieChartIcon className="chart-icon" />
          <div>
            <h3 className="chart-title">Severity Distribution</h3>
            <p className="chart-subtitle">Threat severity breakdown</p>
          </div>
        </div>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{data.length}</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <div className="severity-summary">
          {chartData.map((item, index) => (
            <div key={item.name} className="summary-item">
              <div className="summary-color" style={{ background: item.color }}></div>
              <div className="summary-info">
                <span className="summary-label">{item.name}</span>
                <span className="summary-count">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SeverityDistribution; 