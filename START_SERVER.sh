#!/bin/bash

# Stop oude server op poort 3333
echo "🛑 Stopping any existing server on port 3333..."
lsof -ti:3333 | xargs kill -9 2>/dev/null || true

# Wacht even
sleep 1

# Start nieuwe server
echo "🚀 Starting development server on port 3333..."
npm run dev

