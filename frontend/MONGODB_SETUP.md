# MongoDB Setup Guide

## 🚨 Current Issue
Your backend server can't connect to MongoDB because MongoDB is not running.

## 🚀 Quick Solutions

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Sign up for free account**
3. **Create a new cluster** (choose FREE tier)
4. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

5. **Update your .env file**:
   ```env
   REACT_APP_MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/threat_analysis?retryWrites=true&w=majority
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   ```

### Option 2: Local MongoDB Installation

#### Windows:
1. **Download MongoDB**: https://www.mongodb.com/try/download/community
2. **Install MongoDB**
3. **Start MongoDB Service**:
   ```cmd
   # Run as Administrator
   net start MongoDB
   ```

#### Mac (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 3: Docker (if you have Docker)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🔧 After Setting Up MongoDB

1. **Restart your backend server**:
   ```bash
   cd server
   npm run dev
   ```

2. **You should see**:
   ```
   ✅ Connected to MongoDB successfully
   📊 Database: [your connection string]
   ```

## 📊 Import Your Data

If you have existing data, you can import it using MongoDB Compass or mongoimport:

```bash
mongoimport --db threat_analysis --collection securityevents --file your_data.json
```

## 🆘 Still Having Issues?

1. **Check if MongoDB is running**:
   ```bash
   # Windows
   netstat -an | findstr 27017
   
   # Mac/Linux
   netstat -an | grep 27017
   ```

2. **Test connection**:
   ```bash
   # Windows
   "C:\Program Files\MongoDB\Server\6.0\bin\mongo.exe"
   
   # Mac/Linux
   mongo
   ```

3. **Check your .env file** is in the root directory and has the correct URL

## 🎯 Next Steps

Once MongoDB is connected:
1. Your dashboard will load real data
2. All charts and statistics will be populated
3. You can view, filter, and export security events 