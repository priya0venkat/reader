#!/bin/bash
# Deployment script for Phonics Reader on Google Cloud VM

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv git

# Install Node.js (if not present)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Clone repository
if [ ! -d "reader" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/priya0venkat/reader.git
    cd reader
else
    echo "📥 Updating repository..."
    cd reader
    git pull
fi

# Setup backend
echo "🐍 Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Download NLTK data
python3 -c "import nltk; nltk.download('words')"

# Setup environment
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file (you'll need to add GOOGLE_API_KEY manually)"
    echo "GOOGLE_API_KEY=your_key_here" > .env
fi

cd ..

# Build frontend
echo "⚛️  Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Deployment complete!"
echo ""
echo "To start the server:"
echo "  cd ~/reader/backend"
echo "  source venv/bin/activate"
echo "  uvicorn backend.main:app --host 0.0.0.0 --port 8000"
echo ""
echo "Access at: http://$(curl -s ifconfig.me):8000"
