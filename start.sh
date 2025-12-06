#!/bin/bash

# Start backend
start_backend(){
    cd backend || exit
    source venv/Scripts/activate
    uvicorn app.main:app --reload
}

# Start frontend
start_frontend(){
    cd "$(dirname "$0")/frontend" || exit
    npm run dev
}

# Start backend and frontend in background
start_backend & BACKEND_PID=$!
start_frontend & FRONTEND_PID=$!

# Function to clean up
cleanup(){
    echo "Stopping servers..."
    kill $FRONTEND_PID $BACKEND_PID
    exit 0
}

# Catch CTRL+C
trap cleanup SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
