import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Zap, Eye } from 'lucide-react';
import './StatsCards.css';

const StatsCards = ({ data, stats: apiStats }) => {
  // Use stats from API if available, otherwise calculate from data
  const totalThreats = apiStats?.total || data.length;
  const criticalThreats = apiStats?.critical || data.filter(threat => threat.severity === 'CRITICAL').length;
  const highThreats = apiStats?.high || data.filter(threat => threat.severity === 'HIGH').length;
  const blockedThreats = apiStats?.blocked || data.filter(threat => threat.blocked).length;

  const stats = [
    {
      title: 'Total Threats',
      value: totalThreats,
      icon: AlertTriangle,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Total security events detected'
    },
    {
      title: 'Critical Alerts',
      value: criticalThreats,
      icon: Shield,
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      description: 'High-priority security threats'
    },
    {
      title: 'High Severity',
      value: highThreats,
      icon: Zap,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Medium-priority threats'
    },
    {
      title: 'Blocked Attacks',
      value: blockedThreats,
      icon: Eye,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Successfully prevented attacks'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="stats-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="stat-card"
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="stat-icon-container" style={{ background: stat.gradient }}>
            <stat.icon className="stat-icon" />
          </div>
          
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-description">{stat.description}</div>
          </div>
          
          <div className="stat-trend">
            <div className="trend-indicator">
              <div className="trend-line" style={{ background: stat.color }}></div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards; 