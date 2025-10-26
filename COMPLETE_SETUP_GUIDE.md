# 📚 Complete Setup & Running Guide - Book Recommendation System

## Overview

This guide covers everything needed to run the complete Advanced Book Recommendation System with its full-featured frontend and backend.

**Total Setup Time**: 15-20 minutes

---

## 🎯 What You'll Have

### Backend
- ✅ 97 REST API endpoints
- ✅ 19 specialized services
- ✅ ML recommendation engine
- ✅ User authentication
- ✅ Gamification system
- ✅ Analytics engine
- ✅ 82+ automated tests

### Frontend
- ✅ Modern Next.js 14 UI
- ✅ Responsive design (mobile-first)
- ✅ 8 major pages
- ✅ Real-time search
- ✅ Dark mode
- ✅ Interactive charts
- ✅ Error handling

---

## 📋 Prerequisites

### System Requirements
- OS: Windows, macOS, or Linux
- Python 3.8+
- Node.js 18+
- npm or yarn
- Git
- 2GB RAM minimum
- 500MB free disk space

### Install Required Tools

#### Windows
```powershell
# Using Chocolatey (if installed)
choco install python nodejs git

# Or download from:
# Python: https://www.python.org/downloads/
# Node.js: https://nodejs.org/
# Git: https://git-scm.com/
```

#### macOS
```bash
# Using Homebrew
brew install python node git
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip nodejs npm git
```

### Verify Installation
```bash
python --version      # Should be 3.8+
node --version        # Should be 18+
npm --version         # Should be 9+
git --version         # Should be 2.x+
```

---

## 🚀 Quick Start (5 minutes)

### One-Command Setup
```bash
# Backend
python setup_new_machine.py

# Frontend
cd frontend && npm install
```

### One-Command Run

**Terminal 1 - Backend**
```bash
python start.py
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

**Open in Browser**
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

---

## 📖 Detailed Setup Guide

### Step 1: Backend Setup (Python)

#### 1.1 Navigate to Project
```bash
cd "e:\Python Projects\Book Recommendation System"
# or on macOS/Linux:
cd ~/Projects/Book\ Recommendation\ System
```

#### 1.2 Create Virtual Environment (Recommended)
```bash
# Create venv
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

#### 1.3 Install Dependencies
```bash
pip install -r requirements.txt

# Or update if already installed
pip install -r requirements.txt --upgrade
```

#### 1.4 Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings (or leave as default for local dev)
# Important variables:
# - TMDB_API_KEY (optional, for movie recommendations)
# - GOOGLE_BOOKS_API_KEY (optional, for book data)
# - SMTP_USER, SMTP_PASSWORD (optional, for emails)
```

#### 1.5 Verify Setup
```bash
# Check dependencies
python start.py --check

# Or manually check:
python -c "import fastapi, sqlalchemy, sklearn; print('All dependencies OK')"
```

### Step 2: Frontend Setup (Node.js)

#### 2.1 Navigate to Frontend
```bash
cd frontend
```

#### 2.2 Install Dependencies
```bash
npm install

# Or use yarn
yarn install
```

#### 2.3 Configure Environment
```bash
# Copy environment file
cp .env.example .env.local

# File should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_APP_NAME=BookHub
# NEXT_PUBLIC_APP_VERSION=2.0.0
```

#### 2.4 Verify Installation
```bash
npm run type-check
npm run lint

# Should show no errors
```

---

## ▶️ Running the Application

### Option A: Using Terminal (Recommended for Development)

#### Start Backend
```bash
# From project root
python start.py

# You should see:
# ============================================================
# 📚 Book Recommendation System v2.0
# ============================================================
# 🌐 API Server: http://localhost:8000
# 📖 API Docs: http://localhost:8000/api/docs
```

#### Start Frontend (New Terminal)
```bash
# From project root
cd frontend
npm run dev

# You should see:
# - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

#### Access Application
- **Frontend UI**: http://localhost:3000
- **API Docs**: http://localhost:8000/api/docs
- **GraphQL**: http://localhost:8000/api/graphql

### Option B: Using Docker (Production-like)

#### Build Images
```bash
# From project root
docker build -t bookhub-backend:latest .
cd frontend
docker build -t bookhub-frontend:latest .
```

#### Run Containers
```bash
# From project root
docker-compose up

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

#### Stop Containers
```bash
docker-compose down
```

---

## 🧪 Testing the Application

### Test Backend API

#### Health Check
```bash
curl http://localhost:8000/api/health
```

#### Search Books
```bash
curl -X POST http://localhost:8000/api/books/search \
  -H "Content-Type: application/json" \
  -d '{"query": "python programming", "limit": 5}'
```

#### Get Recommendations
```bash
curl http://localhost:8000/api/recommendations/ml \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "preferences": {"genre": "fiction"}}'
```

#### Run Tests
```bash
pytest tests/ -v

# Run specific test
pytest tests/test_api.py::TestBookEndpoints -v

# With coverage
pytest tests/ --cov=. --cov-report=html
```

### Test Frontend

#### Page Checklist
- [ ] Home page loads (http://localhost:3000)
- [ ] Header and footer display
- [ ] Theme toggle works
- [ ] Search bar works
- [ ] Search results page works
- [ ] Book details page works
- [ ] Recommendations page works
- [ ] Dashboard loads all tabs
- [ ] Analytics page displays charts
- [ ] Mobile responsive (F12 → responsive)

#### Browser DevTools Check
```javascript
// In browser console:
// Check API client is initialized
console.log(window.location)

// Test API call
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(d => console.log('API OK:', d))
```

---

## 📚 Frontend Pages

### Available Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Home page | ✅ Complete |
| `/search?q=query` | Search results | ✅ Complete |
| `/books/[id]` | Book details | ✅ Complete |
| `/recommendations` | Recommendations | ✅ Complete |
| `/dashboard` | User dashboard | ✅ Complete |
| `/analytics` | Analytics charts | ✅ Complete |

### Testing Each Page

```bash
# Home page - automatic
# Just visit http://localhost:3000

# Search page
# Click "Explore Books" or search for a book

# Book details
# Click on any book card

# Recommendations
# Click "Get Recommendations" or visit /recommendations

# Dashboard
# Click "Go to Dashboard"

# Analytics
# Click "Analytics" in navbar
```

---

## 🔌 API Endpoints Overview

### Books (10 endpoints)
```bash
POST   /api/books/search              # Search books
GET    /api/books/trending            # Trending books
GET    /api/books/{book_id}           # Book details
POST   /api/books/favorites           # Add to favorites
```

### Recommendations (8 endpoints)
```bash
POST   /api/recommendations/ml        # ML recommendations
POST   /api/recommendations/tfidf     # TF-IDF algorithm
POST   /api/recommendations/collaborative  # Collaborative filtering
POST   /api/recommendations/hybrid    # Hybrid algorithm
```

### Gamification (12 endpoints)
```bash
GET    /api/gamification/achievements/{user_id}
GET    /api/gamification/leaderboard
GET    /api/gamification/streak/{user_id}
POST   /api/gamification/activity
```

### Analytics (8 endpoints)
```bash
GET    /api/analytics/reading-patterns/{user_id}
GET    /api/analytics/predictions/{user_id}
GET    /api/analytics/reports/{user_id}
```

**See full API docs at**: http://localhost:8000/api/docs

---

## 🎯 Common Tasks

### Search for Books
```bash
# In browser or terminal
curl -X POST http://localhost:8000/api/books/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "the great gatsby",
    "limit": 10
  }'
```

### Get Trending Books
```bash
curl http://localhost:8000/api/books/trending
```

### ML Recommendations
```bash
curl -X POST http://localhost:8000/api/recommendations/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "book_id": "book_456"
  }'
```

### View API Documentation
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **GraphQL**: http://localhost:8000/api/graphql

---

## 🐛 Troubleshooting

### Backend Issues

#### Port 8000 Already in Use
```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=8001 python start.py
```

#### Missing Dependencies
```bash
# Reinstall all dependencies
pip install -r requirements.txt --force-reinstall

# Check for specific issues
python -m pip check
```

#### Import Errors
```bash
# Ensure you're in the right directory
cd "path/to/Book Recommendation System"

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

### Frontend Issues

#### Port 3000 Already in Use
```bash
# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

#### npm Install Failures
```bash
# Clear cache
npm cache clean --force

# Delete lock file
rm package-lock.json

# Reinstall
npm install
```

#### API Connection Issues
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check environment variable in browser console
console.log(process.env.NEXT_PUBLIC_API_URL)

# Update .env.local if needed
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Full rebuild
npm run build -- --no-cache
```

---

## 📊 Performance Benchmarks

### Backend Performance
- **Search**: < 500ms per query
- **Recommendations**: < 1s for 10 recommendations
- **API Response**: < 200ms average

### Frontend Performance
- **Page Load**: < 2s on 4G
- **Search Results**: < 500ms with filtering
- **Dark Mode Toggle**: Instant

---

## 📝 Environment Variables

### Backend (.env)
```env
# API Configuration
API_TIMEOUT=10
DEFAULT_LIMIT=20
MAX_RETRIES=3

# Feature Flags
ENABLE_RECOMMENDATIONS=true
ENABLE_EXPORT=true
AUTO_OPEN_BROWSER=true

# Logging
LOG_LEVEL=INFO

# Optional: Third-party APIs
TMDB_API_KEY=your_key
GOOGLE_BOOKS_API_KEY=your_key
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=BookHub
NEXT_PUBLIC_APP_VERSION=2.0.0
```

---

## 🔐 Security Notes

### Local Development
- Don't commit .env files
- Keep API keys secret
- Use HTTPS in production
- Enable CORS properly

### Production
- Set strong database passwords
- Use environment-specific configs
- Enable rate limiting
- Add API authentication
- Use HTTPS certificate
- Regular security updates

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - Project overview
- `ARCHITECTURE.md` - System architecture
- `frontend/FRONTEND_README.md` - Frontend documentation
- `FRONTEND_DEPLOYMENT_GUIDE.md` - Deployment options
- `FREE_API_KEYS_GUIDE.md` - Third-party API setup
- `DEVOPS_GUIDE.md` - DevOps & deployment

### External Resources
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Python Docs](https://docs.python.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### API Testing Tools
- **Postman**: https://postman.com
- **Thunder Client**: VSCode extension
- **cURL**: Command line tool
- **Insomnia**: https://insomnia.rest

---

## ✅ Verification Checklist

After setup, verify everything works:

### Backend
- [ ] `python start.py` runs without errors
- [ ] http://localhost:8000/api/health returns 200
- [ ] http://localhost:8000/api/docs loads
- [ ] Can search books via API
- [ ] Database connection works
- [ ] Tests pass: `pytest tests/ -v`

### Frontend
- [ ] `npm run dev` runs without errors
- [ ] http://localhost:3000 loads
- [ ] Header and footer display
- [ ] Search bar works
- [ ] API calls succeed
- [ ] No console errors
- [ ] Dark mode works
- [ ] Mobile responsive

### Integration
- [ ] Frontend → Backend API communication works
- [ ] Search results load
- [ ] Book details display
- [ ] Recommendations work
- [ ] Dashboard loads
- [ ] Charts render

---

## 🎉 You're Ready!

Congratulations! Your Book Recommendation System is now running!

### Next Steps
1. **Explore the UI** - Visit http://localhost:3000
2. **Test the APIs** - Visit http://localhost:8000/api/docs
3. **Read the docs** - Check out the documentation files
4. **Customize** - Modify colors, add features, etc.
5. **Deploy** - Follow FRONTEND_DEPLOYMENT_GUIDE.md

---

## 📞 Support

- **Issues**: Check TROUBLESHOOTING.md or GitHub Issues
- **Questions**: Create a Discussion in GitHub
- **Email**: dpharshavardhan.1636@gmail.com
- **Documentation**: See docs/ folder

---

**Happy Reading! 📚✨**

Made with ❤️ for book lovers everywhere
