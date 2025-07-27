#!/bin/bash
echo "Starting ThreatGuard Backend Server..."
echo ""
cd server
echo "Installing dependencies..."
npm install
echo ""
echo "Starting server..."
npm run dev 