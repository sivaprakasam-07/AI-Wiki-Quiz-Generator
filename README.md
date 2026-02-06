# AI Wiki Quiz Generator

## Overview
An AI-powered application that generates quizzes from Wikipedia articles using FastAPI, React, MySQL, and Google Gemini AI.

**Live Demo**: [https://ai-quiz07.web.app](https://ai-quiz07.web.app)

## Features
- Scrapes Wikipedia articles using BeautifulSoup
- Generates multiple-choice quizzes with Google Gemini AI
- Stores quiz history in MySQL database
- Section-wise question grouping
- Related topics suggestions

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+ (for local development)
- PostgreSQL (auto-provisioned on Render for production)

### 1. Database Setup

**For Local Development (MySQL):**
```sql
CREATE DATABASE wiki_quiz;
```

**For Production (PostgreSQL on Render):**
- Database is auto-provisioned by Render
- Connection string provided automatically as `DATABASE_URL`

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

**For Local Development** - Create `backend/.env`:
```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/wiki_quiz
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=http://localhost:5173
```

**For Production (Render)** - Set in Render Dashboard:
```env
DATABASE_URL=postgresql://...  # Auto-provided by Render
GEMINI_API_KEY=your_api_key
GOOGLE_API_KEY=your_api_key
ALLOWED_ORIGINS=https://ai-quiz07.web.app
LLM_MODEL=gemini-2.5-flash
```

Run backend:
```bash
uvicorn app.main:app --reload
```
API available at: `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
UI available at: `http://localhost:5173`

---

## 🌐 Deployment

**Frontend (Firebase)**: [https://ai-quiz07.web.app](https://ai-quiz07.web.app)  
**Backend (Render)**: [https://ai-wiki-quiz-generator-yici.onrender.com](https://ai-wiki-quiz-generator-yici.onrender.com)

### Production Environment Variables
Backend uses PostgreSQL on Render:
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Render)
- `GEMINI_API_KEY` - Google Gemini API key
- `ALLOWED_ORIGINS` - `https://ai-quiz07.web.app`

Frontend `.env`:
- `VITE_API_BASE` - `https://ai-wiki-quiz-generator-yici.onrender.com`

---

## 📚 Environment Variables Reference

### Backend (`backend/.env`)
- **`DATABASE_URL`** - SQLAlchemy connection string  
  Example: `mysql+pymysql://root:password@localhost:3306/wiki_quiz`
- **`GEMINI_API_KEY`** - Google Gemini API key (required for quiz generation)
- **`LLM_MODEL`** - Model name (default: `gemini-2.5-flash`)
- **`ALLOWED_ORIGINS`** - Comma-separated CORS origins (default allows all)

### Frontend (`frontend/.env`)
- **`VITE_API_BASE`** - Backend API URL  
  Local: `http://localhost:8000`  
  Production: `https://ai-wiki-quiz-generator-yici.onrender.com`

---

## 🔌 API Endpoints

**Base URL**: `http://localhost:8000` (local) or `https://ai-wiki-quiz-generator-yici.onrender.com` (production)

### Generate Quiz
```http
POST /api/quizzes/generate
Content-Type: application/json

{
  "url": "https://en.wikipedia.org/wiki/Albert_Einstein",
  "force": false
}
```
- `force: true` - Regenerate even if cached

### Get All Quizzes
```http
GET /api/quizzes
```

### Get Quiz by ID
```http
GET /api/quizzes/{id}
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive Swagger UI

---

## 📁 Project Structure

```
Quiz-Gen/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── scraper.py        # Wikipedia scraper
│   │   ├── llm.py            # Gemini AI integration
│   │   ├── crud.py           # Database operations
│   │   ├── cache.py          # Caching system
│   │   └── prompts/          # LLM prompt templates
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── components/       # React components
│   │   └── styles.css
│   ├── package.json
│   └── .env
└── README.md
```

---

## 🧪 Testing the Application

### Recommended Wikipedia URLs
- [Albert Einstein](https://en.wikipedia.org/wiki/Albert_Einstein) - Fast loading
- [Marie Curie](https://en.wikipedia.org/wiki/Marie_Curie) - Fast loading
- [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing) - Medium size

### Workflow
1. Open frontend at `http://localhost:5173`
2. Paste Wikipedia URL in "Generate Quiz" tab
3. Click "Generate Quiz" (takes 10-30 seconds)
4. View generated quiz with sections
5. Click "Take Quiz" to test yourself
6. Check "Past Quizzes" tab for history

---

## ⚙️ Technologies Used

- **Backend**: FastAPI, SQLAlchemy, BeautifulSoup4, LangChain
- **Frontend**: React 18, Vite
- **Database**: 
  - Local Development: MySQL 8+
  - Production: PostgreSQL (Render)
- **AI**: Google Gemini 2.5-flash
- **Deployment**: Render (backend), Firebase Hosting (frontend)

---

## 📝 Notes

- **Caching**: Duplicate URLs are cached for 60 minutes to avoid re-scraping
- **Fallback**: If Gemini API fails, a deterministic quiz is returned
- **Section Grouping**: Questions are organized by Wikipedia article sections
- **Rate Limits**: Free Gemini API has daily quotas

---

## 🔗 Links

- **GitHub Repository**: [AI-Wiki-Quiz-Generator](https://github.com/sivaprakasam-07/AI-Wiki-Quiz-Generator)
- **Live Demo**: [https://ai-quiz07.web.app](https://ai-quiz07.web.app)
