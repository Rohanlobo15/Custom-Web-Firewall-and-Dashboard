const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// MongoDB Connection
const MONGODB_URL = process.env.REACT_APP_MONGODB_URL;

// Add connection options for better error handling
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  bufferCommands: false // Disable mongoose buffering
};

mongoose.connect(MONGODB_URL, mongooseOptions)
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('📊 Database: Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure MongoDB is running on your system');
  console.log('2. Check if the connection URL is correct');
  console.log('3. Try using MongoDB Atlas (cloud version)');
  console.log('4. Verify your .env file has the correct REACT_APP_MONGODB_URL');
  console.log('\n💡 Quick fix: Update your .env file with a valid MongoDB connection string');
  process.exit(1);
});

// Security Event Schema
const securityEventSchema = new mongoose.Schema({
  eventType: String,
  ipAddress: String,
  userAgent: String,
  endpoint: String,
  method: String,
  requestBody: Object,
  requestHeaders: Object,
  attackPattern: String,
  payload: String,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  blocked: {
    type: Boolean,
    default: true
  },
  country: String,
  city: String,
  region: String,
  userId: String,
  userEmail: String,
  sessionId: String,
  responseStatus: Number,
  responseTime: Number,
  rateLimitInfo: Object,
  tags: [String],
  processed: {
    type: Boolean,
    default: false
  },
  processedAt: Date,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SecurityEvent = mongoose.model('SecurityEvent', securityEventSchema, 'securityevents');

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ThreatGuard API is running',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Get all security events with filtering
app.get('/api/securityevents', async (req, res) => {
  try {
    const { severity, eventType, timeRange, limit = 100, page = 1 } = req.query;
    
    let query = {};
    
    // Filter by severity
    if (severity && severity !== 'all') {
      query.severity = severity;
    }
    
    // Filter by event type
    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }
    
    // Filter by time range
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '1h': new Date(now.getTime() - 60 * 60 * 1000),
        '6h': new Date(now.getTime() - 6 * 60 * 60 * 1000),
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      };
      
      if (timeRanges[timeRange]) {
        query.timestamp = { $gte: timeRanges[timeRange] };
      }
    }
    
    const skip = (page - 1) * limit;
    
    const events = await SecurityEvent.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await SecurityEvent.countDocuments(query);
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching security events:', error);
    res.status(500).json({ error: 'Failed to fetch security events' });
  }
});

// Get events by severity
app.get('/api/securityevents/severity/:severity', async (req, res) => {
  try {
    const { severity } = req.params;
    const events = await SecurityEvent.find({ severity })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by severity:', error);
    res.status(500).json({ error: 'Failed to fetch events by severity' });
  }
});

// Get events by time range
app.get('/api/securityevents/timerange', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const events = await SecurityEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by time range:', error);
    res.status(500).json({ error: 'Failed to fetch events by time range' });
  }
});

// Get event statistics
app.get('/api/securityevents/stats', async (req, res) => {
  try {
    const stats = await SecurityEvent.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'CRITICAL'] }, 1, 0] }
          },
          high: {
            $sum: { $cond: [{ $eq: ['$severity', 'HIGH'] }, 1, 0] }
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$severity', 'MEDIUM'] }, 1, 0] }
          },
          low: {
            $sum: { $cond: [{ $eq: ['$severity', 'LOW'] }, 1, 0] }
          },
          blocked: {
            $sum: { $cond: ['$blocked', 1, 0] }
          },
          processed: {
            $sum: { $cond: ['$processed', 1, 0] }
          }
        }
      }
    ]);
    
    res.json(stats[0] || {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      blocked: 0,
      processed: 0
    });
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    res.status(500).json({ error: 'Failed to fetch event statistics' });
  }
});

// Get attack patterns
app.get('/api/securityevents/patterns', async (req, res) => {
  try {
    const patterns = await SecurityEvent.aggregate([
      {
        $group: {
          _id: '$attackPattern',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.json(patterns);
  } catch (error) {
    console.error('Error fetching attack patterns:', error);
    res.status(500).json({ error: 'Failed to fetch attack patterns' });
  }
});

// Update event status
app.patch('/api/securityevents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { processed } = req.body;
    
    const event = await SecurityEvent.findByIdAndUpdate(
      id,
      { 
        processed,
        processedAt: processed ? new Date() : null
      },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ error: 'Failed to update event status' });
  }
});

// Export events
app.get('/api/securityevents/export', async (req, res) => {
  try {
    const { format = 'json', severity, eventType } = req.query;
    
    let query = {};
    if (severity && severity !== 'all') query.severity = severity;
    if (eventType && eventType !== 'all') query.eventType = eventType;
    
    const events = await SecurityEvent.find(query)
      .sort({ timestamp: -1 })
      .lean();
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=security-events-${new Date().toISOString().split('T')[0]}.json`);
      res.json(events);
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=security-events-${new Date().toISOString().split('T')[0]}.csv`);
      
      const csvHeader = 'ID,Event Type,IP Address,Endpoint,Method,Attack Pattern,Severity,Blocked,Timestamp\n';
      const csvData = events.map(event => 
        `${event._id},${event.eventType},${event.ipAddress},${event.endpoint},${event.method},${event.attackPattern},${event.severity},${event.blocked},${event.timestamp}`
      ).join('\n');
      
      res.send(csvHeader + csvData);
    } else {
      res.status(400).json({ error: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Error exporting events:', error);
    res.status(500).json({ error: 'Failed to export events' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ThreatGuard API server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
}); 