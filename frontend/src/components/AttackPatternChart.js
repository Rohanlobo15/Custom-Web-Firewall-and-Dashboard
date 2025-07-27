import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target } from 'lucide-react';
import './AttackPatternChart.css';

const AttackPatternChart = ({ data }) => {
  // Process data for bar chart
  const processAttackPatternData = () => {
    const patternCounts = {};
    
    data.forEach(threat => {
      const pattern = threat.attackPattern;
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });

    const colors = {
      'SQL_INJECTION_PATTERN': '#dc2626',
      'XSS_PATTERN': '#f59e0b',
      'FILE_SYSTEM_ACCESS_PATTERN': '#3b82f6',
      'SUSPICIOUS_PATTERN': '#10b981'
    };

    return Object.entries(patternCounts)
      .map(([pattern, count]) => ({
        pattern: pattern.replace('_PATTERN', ''),
        count,
        color: colors[pattern] || '#6b7280'
      }))
      .sort((a, b) => b.count - a.count);
  };

  const chartData = processAttackPatternData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Pattern: ${label}`}</p>
          <p className="tooltip-value">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="chart-header">
        <div className="chart-title-section">
          <Target className="chart-icon" />
          <div>
            <h3 className="chart-title">Attack Patterns</h3>
            <p className="chart-subtitle">Most common attack types detected</p>
          </div>
        </div>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Top Pattern</span>
            <span className="stat-value">
              {chartData.length > 0 ? chartData[0].pattern : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="pattern" 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              fill="#ef4444"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <div className="pattern-summary">
          {chartData.slice(0, 4).map((item, index) => (
            <div key={item.pattern} className="pattern-item">
              <div className="pattern-rank">#{index + 1}</div>
              <div className="pattern-info">
                <span className="pattern-name">{item.pattern}</span>
                <span className="pattern-count">{item.count} attacks</span>
              </div>
              <div 
                className="pattern-color" 
                style={{ background: item.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AttackPatternChart; 