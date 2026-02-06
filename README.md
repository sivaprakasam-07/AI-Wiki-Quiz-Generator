# AI Wiki Quiz Generator

## Overview
This project provides a FastAPI backend and a React frontend that accept a Wikipedia URL, scrape the article HTML, and generate a structured quiz with an LLM. Results are stored in MySQL and available in a history tab.

## Requirements
- Python 3.10+
- Node.js 18+
- MySQL 8+

## Backend Setup
1. Create a database named `wiki_quiz`.
2. Copy [backend/.env.example](backend/.env.example) to `backend/.env` and update values.
3. Install dependencies:
   - `cd backend`
   - `python -m venv .venv`
   - `.venv\Scripts\activate`
   - `pip install -r requirements.txt`
4. Run the API:
   - `uvicorn app.main:app --reload`

The API will be available at `http://localhost:8000`.

## Frontend Setup
1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Start the dev server:
   - `npm run dev`

The UI will be available at `http://localhost:5173`.

## Environment Variables
Backend `backend/.env`:
- `DB_URL` - SQLAlchemy connection string.
- `GEMINI_API_KEY` - Gemini API key (required for real LLM output).
- `LLM_MODEL` - Model name, default `gemini-1.5-flash`.
- `ALLOWED_ORIGINS` - Comma-separated list, default allows all.

Frontend `frontend/.env` (optional):
- `VITE_API_BASE` - API base URL, default `http://localhost:8000`.

## API Endpoints
- `POST /api/quizzes/generate` body: `{ "url": "https://en.wikipedia.org/wiki/Alan_Turing", "force": false }` (set `force` to true to regenerate)
- `GET /api/quizzes`
- `GET /api/quizzes/{id}`

## Prompt Templates
- Quiz prompt: [backend/app/prompts/quiz_prompt.txt](backend/app/prompts/quiz_prompt.txt)
- Related topics prompt: [backend/app/prompts/related_topics_prompt.txt](backend/app/prompts/related_topics_prompt.txt)

## Sample Data
See [sample_data/](sample_data/) for example URLs and JSON outputs.

## Screenshots
Capture and add screenshots for:
- Generate Quiz tab
- Past Quizzes tab
- Details modal

## Notes
- If `GEMINI_API_KEY` is not set, the backend returns a deterministic fallback quiz so the UI can be exercised.
