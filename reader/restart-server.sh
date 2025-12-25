#!/bin/bash
cd /home/abhishekverma/reader
pkill -f uvicorn
source backend/venv/bin/activate
nohup uvicorn backend.main:app --host 0.0.0.0 --port 8000 > /tmp/phonics-reader.log 2>&1 &
echo "Server restarted"
sleep 2
curl -s http://localhost:8000/ | head -10
