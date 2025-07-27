import React from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subHours } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import './ThreatChart.css';

const ThreatChart = ({ data }) => {
  // Process data for chart
  const processChartData = () => {
    const now = new Date();
    const timeSlots = [];
    
    // Create time slots for the last 24 hours
    for (let i = 23; i >= 0; i--) {
      const time = subHours(now, i);
      timeSlots.push({
        time: format(time, 'HH:mm'),
        timestamp: time.getTime(),
        threats: 0
      });
    }

    // Count threats in each time slot
    data.forEach(threat => {
      const threatTime = new Date(threat.timestamp);
      const hourDiff = Math.floor((now.getTime() - threatTime.getTime()) / (1000 * 60 * 60));
      
      if (hourDiff >= 0 && hourDiff < 24) {
        const slotIndex = 23 - hourDiff;
        if (timeSlots[slotIndex]) {
          timeSlots[slotIndex].threats += 1;
        }
      }
    });

    return timeSlots;
  };

  const chartData = processChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Time: ${label}`}</p>
          <p className="tooltip-value">{`Threats: ${payload[0].value}`}</p>
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
          <TrendingUp className="chart-icon" />
          <div>
            <h3 className="chart-title">Threat Activity Timeline</h3>
            <p className="chart-subtitle">Last 24 hours threat detection</p>
          </div>
        </div>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Peak</span>
            <span className="stat-value">
              {Math.max(...chartData.map(d => d.threats))}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{data.length}</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="threats" 
              stroke="#ef4444" 
              strokeWidth={2}
              fill="url(#threatGradient)"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ef4444' }}></div>
            <span>Threat Events</span>
          </div>
        </div>
        <div className="chart-actions">
          <button className="btn btn-secondary">Export Data</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatChart; 