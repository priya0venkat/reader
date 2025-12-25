# Interactive Phonics Explorer

**Interactive Phonics Explorer** is a local web application designed to help children practice reading through phonics-based exercises. It leverages AI to generate custom stories and provide real-time reading feedback.

## Features

- **Phonics-Based Word Selection**: Filters words from the NLTK corpus based on specific patterns (e.g., 'ch', 'sh', 'th').
- **AI Story Generation**: Uses Google Gemini to create unique, age-appropriate mini-stories for selected words.
- **Gamified Reader**: A "Space/Dark" themed interface where children can read stories aloud.
- **Real-Time Feedback**: Integrates Web Speech API and AI to listen to the child's reading and provide encouraging feedback.
- **Progress Dashboard**: Tracks learning milestones (words mastered, streaks).

## Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- A Google Gemini API Key

### 1. Backend Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file and add your Google API Key:

   ```bash
   GOOGLE_API_KEY=your_api_key_here
   ```

4. Start the server:

   ```bash
   uvicorn backend.main:app --reload
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install Node dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and go to `http://localhost:5173`.
2. Select a phonics pattern (e.g., "ch").
3. Choose a word from the list.
4. Read the generated story aloud using the "Read Aloud" button.
5. Receive instant feedback from your AI Coach!

## Tech Stack

- **Backend**: Python, FastAPI, NLTK, Google Gemini API
- **Frontend**: React, Vite, Framer Motion, Lucide React
