import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def read_root():
    return {"message": "Interactive Phonics Explorer API"}

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
            f"Write a very short, simple story (3 sentences max) for a child learning to read. "
            f"Use the word '{request.word}' at least once. "
            f"The language should be simple and encouraging."
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
            "feedback": "Great job trying! (Add API Key for AI feedback)",
            "score": "N/A"
        }

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            f"Act as a kind reading coach for a child. "
            f"Original text: '{request.original_text}'. "
            f"Child read: '{request.transcript}'. "
            f"Compare these. If they are close, give positive praise. "
            f"If there are mistakes, kindly point out which word to practice. "
            f"Keep it to 1-2 sentences. Ensure the tone is encouraging."
        )
        response = model.generate_content(prompt)
        return {"feedback": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
