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

# Step 1: Create remote directory
echo "📂 Creating remote directory..."
gcloud compute ssh ${INSTANCE_NAME} --project=${PROJECT_ID} --zone=${ZONE} --command="mkdir -p ${SERVER_PATH}"

# Step 2: Sync backend files using tarball (more reliable)
echo "📦 Compressing and syncing backend files..."
# Create a temporary tarball locally
tar -czf backend-bundle.tar.gz server.js package.json package-lock.json

# Upload tarball
gcloud compute scp --project=${PROJECT_ID} --zone=${ZONE} \
    backend-bundle.tar.gz \
    ${INSTANCE_NAME}:${SERVER_PATH}/

# Extract on server
gcloud compute ssh ${INSTANCE_NAME} --project=${PROJECT_ID} --zone=${ZONE} --command="cd ${SERVER_PATH} && tar -xzf backend-bundle.tar.gz && rm backend-bundle.tar.gz"

# clean up local tarball
rm backend-bundle.tar.gz

# Step 3: Deployment of systemd service
echo "📄 Deploying systemd service file..."
gcloud compute scp --project=${PROJECT_ID} --zone=${ZONE} \
    puzzle-backend.service \
    ${INSTANCE_NAME}:/tmp/puzzle-backend.service

# Step 4: Transfer Credentials
echo "🔑 Transferring GCP credentials..."
gcloud compute ssh ${INSTANCE_NAME} --project=${PROJECT_ID} --zone=${ZONE} --command="mkdir -p /home/abhishekverma/.gcp"
gcloud compute scp --project=${PROJECT_ID} --zone=${ZONE} \
    puzzle-game-credentials.json \
    ${INSTANCE_NAME}:/home/abhishekverma/.gcp/puzzle-game-credentials.json

# Step 5: Configure and Restart
echo "🔧 Configuring backend on server..."
gcloud compute ssh ${INSTANCE_NAME} --project=${PROJECT_ID} --zone=${ZONE} --command="bash -s" << 'ENDSSH'
set -e

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "📦 Installing backend dependencies..."
cd /home/abhishekverma/reader/puzzle-game
npm install --production

# Install systemd service
echo "⚙️  Installing systemd service..."
sudo mv /tmp/puzzle-backend.service /etc/systemd/system/puzzle-backend.service
sudo systemctl daemon-reload
sudo systemctl enable puzzle-backend.service
sudo systemctl restart puzzle-backend.service

# Check service status
echo ""
echo "✅ Deployment complete!"
echo "📊 Service status:"
sudo systemctl status puzzle-backend.service --no-pager -l
ENDSSH

echo ""
echo "🎉 Backend deployment completed successfully!"

