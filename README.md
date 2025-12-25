# Phonics Reader & Games Hub

This repository hosts a collection of educational web games and a specialized Phonics Reader application, designed primarily for early childhood education.

## 🎮 Games Collection

The following games are available as standalone web applications served under `games.verma7.com`:

### 1. **Counting Game** (`/counting-game`)
*   **Goal**: Teach counting from 1 to 20 using one-to-one correspondence.
*   **Mechanics**: Users add treats (apples, cookies, etc.) to a plate to match a target number.
*   **Features**: Audio feedback (speaks numbers), celebratory confetti, smart spiral layout for items.
*   **Tech**: React, Vite, Framer Motion, Canvas Confetti, Web Speech API.

### 2. **Puzzle Game** (`/puzzle-game`)
*   **Goal**: Solve sliding image puzzles.
*   **Features**: Upload custom images, difficulty levels, background hints.
*   **Tech**: React, Node.js backend (for uploads), Google Cloud Storage.

### 3. **US Map Game** (`/us-map-game`)
*   **Goal**: Learn US state locations and names.
*   **Mechanics**: Drag and drop or click to identify states.

### 4. **World Map Game** (`/world-map-game`)
*   **Goal**: Learn world geography (continents, countries).

### 5. **Food Classification Game** (`/food-classification-game`)
*   **Goal**: Categorize foods into groups (Fruits, Vegetables, etc.).

### 6. **Washing Machine Game** (`/washing-machine`)
*   **Goal**: Interactive fun simulation of a washing machine.

---

## 📚 Phonics Reader (`/reader`)
A comprehensive reading assistant application.
*   **Frontend**: React-based reader interface.
*   **Backend**: Python/FastAPI service for text processing and user management.

---

## 🛠 Deployment & Operations

*   **Infrastructure**: Hosted on a Google Cloud Compute Engine VM (`phonics-reader-vm`).
*   **Web Server**: Caddy is used as the reverse proxy and SSL terminator.
*   **Routing**:
    *   `games.verma7.com` -> Serves `index.html` (Games Hub)
    *   `games.verma7.com/counting-game/*` -> `counting-game/dist`
    *   `games.verma7.com/puzzle-game/*` -> `puzzle-game/dist`
    *   (etc.)

For detailed operations (restarting services, logs), see [OPS.md](./OPS.md).

## 🚀 Local Development

Each game is a standalone project. To run one locally:

1.  Navigate to the directory:
    ```bash
    cd counting-game
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the dev server:
    ```bash
    npm run dev
    ```
