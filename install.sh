#!/bin/bash
echo "Installing VPS Guardian..."
# Mock installer
sleep 1
echo "Checking requirements..."
sleep 1
echo "Starting containers..."
docker-compose up -d
echo "Done! Access http://localhost:8080"
