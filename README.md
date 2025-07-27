# ThreatGuard Security Dashboard

A comprehensive security monitoring dashboard that visualizes threat analysis data from the StudyBuddy project's security logs stored in MongoDB. This dashboard provides real-time insights into security events, attack patterns, and threat statistics with an intuitive, modern interface.

## 🎯 Project Overview

**ThreatGuard** is the security monitoring component of the **StudyBuddy** project ecosystem. It connects to the same MongoDB database used by StudyBuddy to retrieve and visualize security event logs, providing administrators with comprehensive threat analysis and monitoring capabilities.

### 🔗 Connection to StudyBuddy Project

This dashboard is a continuation of the StudyBuddy project, utilizing the same MongoDB database (`threat_analysis`) where StudyBuddy's security middleware logs all detected threats, suspicious activities, and security events. The dashboard transforms these raw security logs into actionable insights through interactive visualizations and real-time monitoring.

## 🏗️ Architecture

```
StudyBuddy Project Ecosystem
├── StudyBuddy Application
│   ├── Frontend (StudyBuddy App)
│   ├── Backend (StudyBuddy API)
│   └── Security Middleware
│       └── Logs to MongoDB (threat_analysis.securityevents)
│
└── ThreatGuard Dashboard (This Project)
    ├── Frontend (React Dashboard)
    │   ├── React Components
    │   ├── Custom Hooks
    │   └── API Services
    └── Backend (Node.js API)
        ├── Express Server
        ├── MongoDB Connection
        └── RESTful API Endpoints
```

### 🔄 Data Flow Architecture

```
StudyBuddy Security Events
    ↓ (MongoDB Logging)
threat_analysis.securityevents Collection
    ↓ (API Calls)
ThreatGuard Backend (server.js)
    ↓ (REST API)
ThreatGuard Frontend (React App)
    ↓ (User Interface)
Dashboard Visualization & Monitoring
```

## 📁 Project Structure

```
dashboard/
├── 📁 frontend/                     # React Frontend Application
│   ├── 📁 public/                  # Static assets
│   │   ├── index.html             # Main HTML file
│   │   ├── manifest.json          # PWA manifest
│   │   └── favicon.ico            # App icon
│   ├── 📁 src/                    # React source code
│   │   ├── 📁 components/         # React components
│   │   │   ├── Header.js         # Dashboard header with live status
│   │   │   ├── Header.css        # Header styles
│   │   │   ├── StatsCards.js     # Key statistics cards
│   │   │   ├── StatsCards.css    # Stats cards styles
│   │   │   ├── ThreatChart.js    # Timeline chart of threats
│   │   │   ├── ThreatChart.css   # Chart styles
│   │   │   ├── SeverityDistribution.js # Pie chart of threat severity
│   │   │   ├── SeverityDistribution.css # Distribution styles
│   │   │   ├── AttackPatternChart.js   # Bar chart of attack patterns
│   │   │   ├── AttackPatternChart.css  # Pattern chart styles
│   │   │   ├── ThreatTable.js    # Detailed threat events table
│   │   │   └── ThreatTable.css   # Table styles
│   │   ├── 📁 services/          # API services
│   │   │   └── api.js            # Axios API client
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   │   └── useSecurityEvents.js # Data fetching and management
│   │   ├── App.js                # Main application component
│   │   ├── App.css               # Main app styles
│   │   ├── index.js              # Application entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Frontend dependencies
│   ├── package-lock.json         # Dependency lock file
│   └── start-servers.js          # Concurrent server startup script
│
├── 📁 server/                     # Node.js Backend API
│   ├── server.js                 # Express server with MongoDB connection
│   ├── package.json              # Backend dependencies
│   └── package-lock.json         # Dependency lock file
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This documentation file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (running instance or MongoDB Atlas)
- **StudyBuddy Project** (with security logging enabled)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd threatguard-dashboard
```

### 2. Environment Configuration

#### Frontend Environment (Frontend Directory)

Create `.env` file in the `frontend/` directory:

```env
# Frontend Environment Variables
REACT_APP_MONGODB_URL=mongodb://localhost:27017/threat_analysis
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

#### Backend Environment (Server Directory)

Create `.env` file in the `server/` directory:

```env
# Backend Environment Variables
MONGODB_URL=mongodb://localhost:27017/threat_analysis
PORT=3001
```

### 3. Install Dependencies

#### Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Return to root directory
cd ..
```

#### Backend Dependencies

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Return to root directory
cd ..
```

### 4. Start the Application

#### Option A: Start Both Servers (Recommended)

```bash
# Navigate to frontend directory
cd frontend

# Start both frontend and backend concurrently
npm run dev
```

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Access the Dashboard

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 🔧 Environment Variables Explained

### Frontend (frontend/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_MONGODB_URL` | MongoDB connection string (for reference) | `mongodb://localhost:27017/threat_analysis` |
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |

### Backend (server/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string for server | `mongodb://localhost:27017/threat_analysis` |
| `PORT` | Backend server port | `3001` |

## 🗄️ MongoDB Configuration

### Database Connection

The dashboard connects to the same MongoDB database used by StudyBuddy:

- **Database**: `threat_analysis`
- **Collection**: `securityevents`

### Data Schema

The security events collection contains documents with the following structure:

```javascript
{
  _id: ObjectId,
  eventType: String,           // Type of security event
  ipAddress: String,           // Source IP address
  userAgent: String,           // User agent string
  endpoint: String,            // API endpoint accessed
  method: String,              // HTTP method
  requestBody: Object,         // Request body data
  requestHeaders: Object,      // Request headers
  attackPattern: String,       // Detected attack pattern
  payload: String,             // Raw payload data
  severity: String,            // CRITICAL, HIGH, MEDIUM, LOW
  blocked: Boolean,            // Whether request was blocked
  country: String,             // Geographic location
  city: String,
  region: String,
  userId: String,              // User ID (if authenticated)
  userEmail: String,           // User email (if authenticated)
  sessionId: String,           // Session ID
  responseStatus: Number,      // HTTP response status
  responseTime: Number,        // Response time in ms
  rateLimitInfo: Object,       // Rate limiting information
  tags: Array,                 // Event tags
  processed: Boolean,          // Whether event was processed
  processedAt: Date,           // Processing timestamp
  timestamp: Date,             // Event timestamp
  createdAt: Date,             // Document creation time
  updatedAt: Date              // Document update time
}
```

## 📊 Dashboard Features

### 1. Real-Time Statistics
- **Total Threats**: Count of all security events
- **Critical Alerts**: High-priority security incidents
- **High Severity**: Important security events
- **Blocked Attacks**: Successfully prevented threats

### 2. Interactive Charts
- **Threat Activity Timeline**: 24-hour threat detection graph
- **Severity Distribution**: Pie chart showing threat severity breakdown
- **Attack Patterns**: Bar chart of most common attack types

### 3. Detailed Threat Table
- **Search & Filter**: Find specific threats by type, severity, or content
- **Sorting**: Sort by timestamp, event type, severity, etc.
- **Real-time Updates**: Auto-refresh every 30 seconds

### 4. Recent Activity Panel
- **10-Minute Window**: Shows only recent security events
- **Manual Refresh**: Update data on demand
- **Event Details**: IP addresses, endpoints, and attack patterns

## 🛠️ API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Security Events
- `GET /api/securityevents` - Get all security events with filtering
- `GET /api/securityevents/severity/:severity` - Filter by severity
- `GET /api/securityevents/timerange` - Filter by time range
- `GET /api/securityevents/stats` - Get aggregated statistics
- `GET /api/securityevents/patterns` - Get attack pattern statistics
- `PATCH /api/securityevents/:id` - Update event status
- `GET /api/securityevents/export` - Export events (JSON/CSV)

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3b82f6` - Main brand color
- **Critical Red**: `#ef4444` - High-priority alerts
- **Warning Orange**: `#f97316` - Medium-priority alerts
- **Success Green**: `#22c55e` - Low-priority alerts
- **Background**: `#0f0f23` to `#16213e` - Dark gradient theme

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Monospace**: Courier New (for timestamps and IP addresses)

### Icons
- **Icon Library**: Lucide React
- **Style**: Outlined, consistent stroke width
- **Colors**: Semantic (red for critical, orange for warnings, etc.)

## 🔒 Security Features

### Data Protection
- **Environment Variables**: Sensitive data stored in .env files
- **Git Ignore**: .env files excluded from version control
- **Input Validation**: Server-side validation of all inputs
- **CORS Configuration**: Proper cross-origin resource sharing

### Access Control
- **Read-Only Dashboard**: No modification of security logs
- **Status Updates**: Only event processing status can be updated
- **Audit Trail**: All actions logged for compliance

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
# Frontend build
cd frontend
npm run build

# Backend start
cd ../server
npm start
```

### Environment Variables for Production
```env
# Production MongoDB (use MongoDB Atlas)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/threat_analysis

# Production API URL
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
Error: connect ECONNREFUSED ::1:27017
```
**Solution**: Ensure MongoDB is running or use MongoDB Atlas

#### 2. Backend Server Not Starting
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in the server directory

#### 3. Frontend Build Errors
```
Error: Cannot resolve 'recharts'
```
**Solution**: Run `npm install` in the frontend directory

#### 4. Environment Variables Not Loading
```
Error: process.env.MONGODB_URL is undefined
```
**Solution**: Check .env file location and variable names

### Debug Mode
```bash
# Backend with debug logging
cd server
DEBUG=* npm run dev

# Frontend with detailed errors
cd frontend
REACT_APP_DEBUG=true npm start
```

## 📈 Performance Optimization

### Frontend
- **Lazy Loading**: Components load on demand
- **Memoization**: React.memo for expensive components
- **Debounced Search**: Optimized search performance
- **Virtual Scrolling**: Efficient large dataset rendering

### Backend
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Redis integration (optional)
- **Compression**: Gzip compression enabled
- **Connection Pooling**: Efficient database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **StudyBuddy Team**: For the security logging infrastructure
- **MongoDB**: For the robust database solution
- **React Community**: For the excellent frontend framework
- **Recharts**: For the beautiful chart components
- **Lucide**: For the consistent icon library

## 📞 Support

For support and questions:
- **Issues**: Create an issue in the repository
- **Documentation**: Check the inline code comments
- **Community**: Join our development community

---

**ThreatGuard Dashboard** - Securing the future of education technology through comprehensive threat monitoring and analysis. 