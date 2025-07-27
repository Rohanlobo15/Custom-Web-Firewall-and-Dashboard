# Environment Variables Setup

## 🚨 Issue Fixed
The server was incorrectly looking for `REACT_APP_MONGODB_URL` instead of `MONGODB_URL`.

## 📁 File Structure
```
dashboard/
├── .env                    ← Frontend environment variables
├── server/
│   ├── .env               ← Backend environment variables (create this)
│   └── server.js
└── src/
```

## 🔧 Environment Files Setup

### 1. Frontend Environment (Root directory)
Create `.env` in the root directory:
```env
REACT_APP_MONGODB_URL=mongodb://localhost:27017/threat_analysis
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### 2. Backend Environment (Server directory)
Create `.env` in the `server/` directory:
```env
MONGODB_URL=mongodb://localhost:27017/threat_analysis
PORT=3001
```

## 🎯 What Each File Does

### Frontend (.env in root):
- `REACT_APP_MONGODB_URL`: Used by React app (if needed)
- `REACT_APP_API_BASE_URL`: Used by React app to call backend API

### Backend (.env in server/):
- `MONGODB_URL`: Used by Node.js server to connect to MongoDB
- `PORT`: Port for the backend server

## 🚀 How to Create the Files

### Option 1: Command Line
```bash
# Frontend .env (in root directory)
echo REACT_APP_MONGODB_URL=mongodb://localhost:27017/threat_analysis > .env
echo REACT_APP_API_BASE_URL=http://localhost:3001/api >> .env

# Backend .env (in server directory)
cd server
echo MONGODB_URL=mongodb://localhost:27017/threat_analysis > .env
echo PORT=3001 >> .env
```

### Option 2: Manual Creation
1. Create `.env` file in root directory
2. Create `.env` file in `server/` directory
3. Add the content above to each file

## 🔍 Current Status
- ✅ Server now looks for `MONGODB_URL` (correct)
- ❌ Need to create `server/.env` file
- ❌ Need MongoDB running on port 27017

## 📊 Next Steps
1. Create the `server/.env` file
2. Start MongoDB
3. Restart the backend server 