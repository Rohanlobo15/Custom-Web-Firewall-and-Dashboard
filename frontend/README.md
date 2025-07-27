# ThreatGuard - Security Analysis Dashboard

A modern, interactive React dashboard for real-time threat analysis and security monitoring. Built with beautiful animations, responsive design, and comprehensive data visualization.

## 🚀 Features

### 📊 **Interactive Dashboards**
- **Real-time Threat Monitoring** - Live security event tracking
- **Statistical Overview** - Key metrics and KPIs at a glance
- **Severity Distribution** - Visual breakdown of threat levels
- **Attack Pattern Analysis** - Most common attack types detection
- **Timeline Charts** - 24-hour threat activity visualization

### 🎨 **Modern UI/UX**
- **Glass Morphism Design** - Beautiful backdrop blur effects
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Works perfectly on all devices
- **Dark Theme** - Professional security-focused design
- **Interactive Elements** - Hover effects and micro-interactions

### 🔍 **Advanced Functionality**
- **Real-time Alerts** - Live security notifications
- **Search & Filter** - Advanced threat filtering capabilities
- **Sortable Tables** - Interactive data tables with sorting
- **Export Features** - Data export functionality
- **Status Indicators** - Visual threat status representation

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Modern icon library
- **Date-fns** - Date manipulation utilities
- **React Hot Toast** - Elegant notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd threat-analysis-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your MongoDB connection
   REACT_APP_MONGODB_URL=mongodb://localhost:27017/threat_analysis
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Data Structure

The dashboard expects threat data in the following format:

```javascript
{
  _id: "unique_id",
  eventType: "SUSPICIOUS_INPUT" | "SQL_INJECTION" | "XSS_ATTEMPT",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  endpoint: "/api/users/register",
  method: "POST",
  attackPattern: "SQL_INJECTION_PATTERN",
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  blocked: true,
  timestamp: "2025-07-27T05:50:12.998+00:00",
  processed: false
}
```

## 🎯 Key Components

### **StatsCards**
- Displays key metrics (Total Threats, Critical Alerts, etc.)
- Animated counters with trend indicators
- Color-coded severity levels

### **ThreatChart**
- 24-hour timeline of threat activity
- Area chart with gradient fills
- Interactive tooltips

### **SeverityDistribution**
- Pie chart showing threat severity breakdown
- Custom legend with counts
- Color-coded segments

### **AttackPatternChart**
- Bar chart of most common attack patterns
- Sorted by frequency
- Pattern ranking system

### **ThreatTable**
- Detailed view of all security events
- Search and filter functionality
- Sortable columns
- Export capabilities

### **RealTimeAlerts**
- Live security notifications
- Animated alert cards
- Pause/resume functionality

## 🎨 Design System

### **Color Palette**
- **Critical**: `#dc2626` (Red)
- **High**: `#f59e0b` (Orange)
- **Medium**: `#3b82f6` (Blue)
- **Low**: `#10b981` (Green)

### **Typography**
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### **Spacing**
- Consistent 8px grid system
- Responsive breakpoints

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints at:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔧 Customization

### **Adding New Charts**
1. Create a new component in `src/components/`
2. Import and use Recharts components
3. Add to the main dashboard layout

### **Modifying Colors**
Update the color constants in individual component CSS files or create a global theme file.

### **Adding New Data Sources**
Modify the data processing functions in each component to handle your specific data format.

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Netlify**
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### **Deploy to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for security professionals** 