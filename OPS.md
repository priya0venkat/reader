# Phonics Reader & Games - Operations Manual

This guide describes how to manage the backend services for the Phonics Reader and Puzzle games hosted on the VM (`phonics-reader-vm`).

## System Overview

*   **Node.js Backend (Puzzle Game)**: Runs on port `3002`. Managed by systemd service `puzzle-backend`.
*   **Python Backend (Auth/API)**: Runs on port `3001`. Managed by systemd service `reader-backend` (or similar).
*   **Web Server (Caddy)**: Handles SSL and reverse proxying. Managed by systemd.

## Common Tasks

### 1. Restarting the Puzzle Game Backend
If you change the `server.js` code or need to reload configuration:

```bash
sudo systemctl restart puzzle-backend
```

To check if it restarted successfully:
```bash
sudo systemctl status puzzle-backend
```
(Look for `Active: active (running)`)

### 2. Updating the Code (Games Frontend)
To pull the latest changes from GitHub and deploy the games frontend:

```bash
# From local machine
gcloud compute ssh verma-games --zone=us-central1-a --command='cd ~/reader && git pull && cd games-frontend && npm run build'
```

Or if you're already SSH'd into the VM:
```bash
cd ~/reader
git pull
cd games-frontend
npm run build
```

### 3. Checking Logs
To see the real-time logs for the puzzle backend:

```bash
sudo journalctl -u puzzle-backend -f
```
(Press `Ctrl+C` to exit)

To see the last 50 error lines:
```bash
sudo journalctl -u puzzle-backend -n 50 --no-pager
```

## Troubleshooting

### Uploads Failing with 500 Internal Server Error
**Symptoms:**
*   Frontend shows "Internal Server Error".
*   Upload request fails.

**Cause:**
This often happens if a **manually started** Node.js process is running in the background ("zombie process") and blocking the official systemd service. This zombie process usually lacks the necessary Google Cloud credentials.

**Fix:**
1.  **Stop the service:**
    ```bash
    sudo systemctl stop puzzle-backend
    ```
2.  **Kill ALL Node.js processes:**
    ```bash
    sudo pkill -9 node
    ```
3.  **Start the service again:**
    ```bash
    sudo systemctl start puzzle-backend
    ```
4.  **Verify status:**
    ```bash
    sudo systemctl status puzzle-backend
    ```

### Changes Not Visible / Browser Caching
If you updated the code but don't see changes (especially image lists):
1.  **Hard Refresh** your browser: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows).
2.  The backend is now configured to send `Cache-Control: no-store` to prevent this.

## Service Configuration Files

*   **Puzzle Backend Service:** `/etc/systemd/system/puzzle-backend.service`
*   **Caddy Configuration:** `/etc/caddy/Caddyfile` or local `~/reader/Caddyfile` (depending on setup, check `systemctl status caddy` to confirm).
