#!/bin/bash
cd /home/abhishekverma/reader
source backend/venv/bin/activate
pkill -f uvicorn
nohup uvicorn backend.main:app --host 0.0.0.0 --port 8000 > /tmp/phonics-reader.log 2>&1 &
echo "Server started. Check logs at /tmp/phonics-reader.log"
sleep 2
curl -s http://localhost:8000/words?pattern=ch&limit=2
