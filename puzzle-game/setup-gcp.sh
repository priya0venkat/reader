#!/bin/bash
set -e

# Configuration
PROJECT_ID="freqtrade-478700"
SA_NAME="puzzle-game-backend"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="puzzle-game-credentials.json"
BUCKET_NAME="purejax-data-1234"

echo "🚀 Setting up GCP resources..."

# 1. Create Service Account (if not exists)
if ! gcloud iam service-accounts describe ${SA_EMAIL} --project=${PROJECT_ID} &>/dev/null; then
    echo "Creating service account: ${SA_NAME}..."
    gcloud iam service-accounts create ${SA_NAME} \
        --display-name="Puzzle Game Backend" \
        --project=${PROJECT_ID}
else
    echo "Service account ${SA_NAME} already exists."
fi

# 2. Grant permissions (Storage Object Admin)
echo "Granting permissions..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.objectAdmin" \
    --no-user-output-enabled

# 3. Create Key
echo "Creating JSON key..."
if [ -f "${KEY_FILE}" ]; then
    echo "Backing up existing key..."
    mv "${KEY_FILE}" "${KEY_FILE}.bak"
fi
gcloud iam service-accounts keys create ${KEY_FILE} \
    --iam-account=${SA_EMAIL} \
    --project=${PROJECT_ID}

echo "✅ Key created at: $(pwd)/${KEY_FILE}"

# 4. Fix SSH Firewall
echo "🔧 Checking firewall rules for SSH..."
if ! gcloud compute firewall-rules describe allow-ssh-ingress --project=${PROJECT_ID} &>/dev/null; then
    echo "Creating firewall rule 'allow-ssh-ingress'..."
    gcloud compute firewall-rules create allow-ssh-ingress \
        --project=${PROJECT_ID} \
        --direction=INGRESS \
        --priority=1000 \
        --network=default \
        --action=ALLOW \
        --rules=tcp:22 \
        --source-ranges=0.0.0.0/0
else
    echo "Firewall rule 'allow-ssh-ingress' already exists."
fi

echo "🎉 Setup complete! You should now have the key and SSH access."
