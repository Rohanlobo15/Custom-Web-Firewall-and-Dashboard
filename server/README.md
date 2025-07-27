# ThreatGuard Backend Server

A Node.js/Express server that connects to MongoDB and provides RESTful APIs for the ThreatGuard security dashboard.

## 🚀 Features

- **MongoDB Integration** - Connects to your `securityevents` collection
- **RESTful APIs** - Complete CRUD operations for security events
- **Real-time Statistics** - Aggregated data for dashboard metrics
- **Filtering & Pagination** - Advanced query capabilities
- **Export Functionality** - JSON and CSV export options
- **Security** - Helmet.js for security headers
- **CORS Support** - Cross-origin resource sharing enabled

## 📦 Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   REACT_APP_MONGODB_URL=mongodb://localhost:27017/threat_analysis
   PORT=3001
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server status and database connection

### Security Events
- `GET /api/securityevents` - Get all events with filtering
- `GET /api/securityevents/severity/:severity` - Get events by severity
- `GET /api/securityevents/timerange` - Get events by time range
- `GET /api/securityevents/stats` - Get aggregated statistics
- `GET /api/securityevents/patterns` - Get attack pattern distribution
- `PATCH /api/securityevents/:id` - Update event status
- `GET /api/securityevents/export` - Export events (JSON/CSV)

## 📊 Query Parameters

### Filtering
- `severity` - Filter by severity level (LOW, MEDIUM, HIGH, CRITICAL)
- `eventType` - Filter by event type
- `timeRange` - Filter by time range (1h, 6h, 24h, 7d)

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)

### Export
- `format` - Export format (json, csv)

## 🗄️ Database Schema

The server expects your MongoDB collection `securityevents` to have documents with this structure:

```javascript
{
  _id: ObjectId,
  eventType: String,
  ipAddress: String,
  userAgent: String,
  endpoint: String,
  method: String,
  requestBody: Object,
  requestHeaders: Object,
  attackPattern: String,
  payload: String,
  severity: String, // LOW, MEDIUM, HIGH, CRITICAL
  blocked: Boolean,
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
  processed: Boolean,
  processedAt: Date,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables
- `REACT_APP_MONGODB_URL` - MongoDB connection string
- `PORT` - Server port (default: 3001)

### CORS Configuration
The server is configured to allow requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:3001` (API server)

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t threatguard-server .
docker run -p 3001:3001 threatguard-server
```

## 📈 Monitoring

The server includes:
- **Morgan logging** - HTTP request logging
- **Error handling** - Comprehensive error responses
- **Health checks** - Database connection monitoring

## 🔒 Security

- **Helmet.js** - Security headers
- **CORS** - Cross-origin protection
- **Input validation** - Query parameter sanitization
- **Error handling** - No sensitive data exposure

## 📝 Logs

Server logs include:
- Database connection status
- API request/response details
- Error messages with stack traces
- Performance metrics

---

**Ready to serve your ThreatGuard dashboard! 🛡️** 