import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from backend.utils.phonics import get_words_by_pattern

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

class StoryRequest(BaseModel):
    word: str

class FeedbackRequest(BaseModel):
    original_text: str
    transcript: str

@app.get("/words")
def get_words(pattern: str = "ch", limit: int = 5):
    """
    Get words matching a phonics pattern.
    """
    try:
        words = get_words_by_pattern(pattern, limit)
        return {"words": words}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-gemini")
def test_gemini():
    if not GOOGLE_API_KEY:
         return {"status": "error", "message": "GOOGLE_API_KEY not set"}
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Say hello in one word.")
        return {"status": "ok", "response": response.text}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/story")
def generate_story(request: StoryRequest):
    """
    Generate a mini-story using Gemini.
    """
    if not GOOGLE_API_KEY:
        # Fallback if no API Key is present
        return {
            "story": f"The {request.word} is here. It is a nice {request.word}. Look at the {request.word}.",
            "generated": False
        }
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            f"Write exactly ONE very simple, short sentence (~5-7 words) for a toddler. "
            f"Use the word '{request.word}'. "
            f"Do NOT use any emojis. Keep it plain text."
        )
        response = model.generate_content(prompt)
        return {"story": response.text, "generated": True}
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
def generate_feedback(request: FeedbackRequest):
    """
    Provide feedback on reading.
    """
    if not GOOGLE_API_KEY:
        return {
            "feedback": "Great job! (Add API Key for AI feedback)",
            "score": "N/A"
        }

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            f"Act as a cheerleader for a toddler. "
            f"Original: '{request.original_text}'. "
            f"Child said: '{request.transcript}'. "
            f"If they got the main word '{request.original_text.split()[0]}', EXCLAIM 'Great Job!' or 'Wow!'. "
            f"Ignore minor mistakes. Keep it under 10 words."
        )
        response = model.generate_content(prompt)
        return {"feedback": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =================================================================
# SERVE FRONTEND (SPA Support)
# =================================================================

# 1. Mount /assets first so they are served correctly
if os.path.exists("frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# 2. Catch-all route for Index/SPA (MUST BE LAST)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Skip API routes if they accidentally fall through (which shouldn't happen due to route ordering)
    if full_path.startswith("api"):
        raise HTTPException(status_code=404)
        
    # Serve specific files if they exist (vite.svg, favicon, etc)
    dist_path = f"frontend/dist/{full_path}"
    if os.path.exists(dist_path) and os.path.isfile(dist_path):
        return FileResponse(dist_path)
    
    # Otherwise serve index.html for SPA routing
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    
    return {"message": "Frontend not built. Run 'npm run build' in frontend/ directory."}
