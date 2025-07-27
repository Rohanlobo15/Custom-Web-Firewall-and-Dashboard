import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Clock, Wifi } from 'lucide-react';
import './Header.css';

const Header = () => {
  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();

  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-content">
        <div className="header-left">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="logo-icon" />
            <div className="logo-text">
              <h1 className="logo-title">ThreatGuard</h1>
              <p className="logo-subtitle">Security Dashboard</p>
            </div>
          </motion.div>
        </div>

        <div className="header-center">
          <div className="status-indicators">
            <motion.div 
              className="status-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Activity className="status-icon pulse" />
              <span>Live Monitoring</span>
            </motion.div>
            
            <motion.div 
              className="status-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Wifi className="status-icon" />
              <span>Connected</span>
            </motion.div>
          </div>
        </div>

        <div className="header-right">
          <motion.div 
            className="time-display"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Clock className="time-icon" />
            <div className="time-info">
              <span className="current-time">{currentTime}</span>
              <span className="current-date">{currentDate}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 