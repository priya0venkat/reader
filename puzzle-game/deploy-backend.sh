#!/bin/bash
# Deployment script for Puzzle Game Backend on games.verma7.com

set -e  # Exit on error

INSTANCE_NAME="phonics-reader-vm"
PROJECT_ID="freqtrade-478700"
ZONE="us-central1-a"  # Assuming zone based on subnet, will auto-detect if needed
SERVER_USER="abhishekverma"
SERVER_PATH="/home/abhishekverma/reader/puzzle-game"

echo "🚀 Starting puzzle game backend deployment via gcloud..."

# Get Zone if not hardcoded (safer)
ZONE=$(gcloud compute instances list --filter="name=${INSTANCE_NAME}" --format="value(zone)" --project=${PROJECT_ID})
echo "📍 Target Instance: ${INSTANCE_NAME} in zone ${ZONE}"

# Step 1: Transfer Credentials
echo "🔑 Transferring GCP credentials..."
gcloud compute ssh ${INSTANCE_NAME} --project=${PROJECT_ID} --zone=${ZONE} --command="mkdir -p /home/abhishekverma/.gcp"
gcloud compute scp --project=${PROJECT_ID} --zone=${ZONE} \
    puzzle-game-credentials.json \
    ${INSTANCE_NAME}:/home/abhishekverma/.gcp/puzzle-game-credentials.json

# Step 2: Deployment via Git
echo "📦 Syncing code via Git..."
gcloud compute ssh ${INSTANCE_NAME} --project=${PROJECT_ID} --zone=${ZONE} --command="bash -s" << 'ENDSSH'
set -e

# Navigate to repo
cd /home/abhishekverma/reader

# Discard local changes to avoid conflicts (if any) and pull
git reset --hard
git pull origin main

# Install dependencies & Build Frontend
echo "📦 Installing dependencies & building..."
cd puzzle-game
npm install
npm run build

# Install systemd service (it's now in the repo!)
echo "⚙️  Installing systemd service..."
sudo cp puzzle-backend.service /etc/systemd/system/puzzle-backend.service
sudo systemctl daemon-reload
sudo systemctl enable puzzle-backend.service
sudo systemctl restart puzzle-backend.service

# Reload Caddy to pick up Caddyfile changes
echo "🔄 Reloading Caddy..."
sudo systemctl reload caddy

# Check service status
echo ""
echo "✅ Deployment complete!"
echo "📊 Service status:"
sudo systemctl status puzzle-backend.service --no-pager -l
ENDSSH

echo ""
echo "🎉 Backend deployment completed successfully!"

