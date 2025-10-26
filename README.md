# 📚 BookHub - Intelligent Book Recommendation Platform

<div align="center">

[![Python 3.9+](https://img.shields.io/badge/python-3.9%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)](https://fastapi.tiangolo.com/)
[![Next.js 14+](https://img.shields.io/badge/Next.js-14%2B-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3%2B-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A full-stack book recommendation platform with AI, gamification, and community features.**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 🎯 Overview

BookHub is a comprehensive book recommendation system powered by machine learning and AI. It provides users with personalized book recommendations, advanced search, social features, gamification, and integrations with popular book retailers and libraries.

**Status**: ✅ Production-Ready (v2.0)

---

## ✨ Features

### 📖 Core Features
- **Advanced Book Search** - Natural language processing, full-text search, smart filtering
- **Personalized Recommendations** - ML-powered, mood-based, collaborative filtering
- **Reading Analytics** - Detailed statistics, reading patterns, year-in-review
- **Reading History** - Track all books with status, ratings, and notes
- **Favorites Management** - Save and organize favorite books

### 🎮 Gamification
- **Achievements** - Unlock badges and milestones
- **Leaderboards** - Multiple ranking systems (books read, streaks, points)
- **Reading Streaks** - Track consistent reading habits
- **Points System** - Earn points for reading activities
- **Rewards** - Unlock virtual rewards and badges

### 🤖 AI & Innovation
- **AI Summaries** - Generate book summaries with adjustable length
- **Reading Companion Chat** - AI chatbot for book discussions
- **Q&A System** - Ask questions about books using Gemini AI
- **AI Cover Generation** - Generate creative book covers
- **Movie Adaptations** - Find movie/TV adaptations of books

### 📚 Educational
- **Literary Analysis** - Themes, analysis, and historical context
- **Reading Guides** - Discussion questions and study materials
- **Author Profiles** - Comprehensive author information
- **Vocabulary Learning** - Language learning support
- **Timeline & Context** - Historical and cultural background

### 🔗 Integrations
- **Purchase Links** - Multi-retailer price comparison (Amazon, Goodreads, etc.)
- **Library Finder** - OverDrive library availability checker
- **Kindle Integration** - Send books to Kindle devices
- **Goodreads Import** - Import reading history from Goodreads
- **Calendar Scheduling** - Plan your reading schedule

### 👥 Community
- **Book Clubs** - Create and manage book clubs
- **User Network** - Find similar readers
- **Activity Feed** - Share reading activities
- **Discussions** - Participate in book discussions
- **Reviews & Ratings** - Read and write community reviews

### ⚙️ Developer Features
- **REST API** - 97+ endpoints with full documentation
- **Webhooks** - Real-time event notifications
- **GraphQL** - Alternative query interface
- **SDK Support** - Official Python and JavaScript SDKs
- **API Keys** - For programmatic access

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (optional, SQLite for development)
- **Redis** (optional, for caching)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/bookhub.git
cd bookhub

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run API server
python api.py
```

The API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

---

## 📁 Project Structure

```
bookhub/
├── backend/                    # Python/FastAPI backend
│   ├── api.py                 # Main API application (97+ endpoints)
│   ├── models/                # Data models
│   ├── services/              # Business logic (20+ modules)
│   ├── database/              # Database models and utilities
│   ├── tests/                 # Unit tests
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # Next.js/React frontend
│   ├── src/
│   │   ├── app/              # 32+ pages
│   │   ├── components/       # Reusable components
│   │   ├── lib/              # API client and utilities
│   │   └── types/            # TypeScript definitions
│   ├── public/               # Static assets
│   └── package.json          # Node dependencies
│
├── docs/                     # Documentation
├── .github/                  # GitHub Actions CI/CD
├── docker-compose.yml       # Docker Compose configuration
└── Dockerfile              # Backend Docker image
```

---

## 🔌 API Endpoints

The API provides 97+ endpoints organized by category:

### Main Categories
- **Search & Recommendations** (8 endpoints)
- **User Management** (5 endpoints)
- **Analytics** (12 endpoints)
- **Gamification** (8 endpoints)
- **Educational** (7 endpoints)
- **AI & Innovation** (9 endpoints)
- **Integrations** (6 endpoints)
- **Security** (6 endpoints)
- **And more...**

### Example Requests

```bash
# Search books
curl -X POST http://localhost:8000/api/books/search \
  -H "Content-Type: application/json" \
  -d '{"query": "science fiction", "limit": 10}'

# Get recommendations
curl -X POST http://localhost:8000/api/recommendations/ml \
  -H "Content-Type: application/json" \
  -d '{"target_book_id": "123", "limit": 10}'

# Get user profile
curl http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [API Documentation](docs/API.md) for complete endpoint reference.

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database access
- **PostgreSQL/SQLite** - Relational database
- **Redis** - Caching layer
- **Celery** - Asynchronous task queue
- **Pytest** - Testing framework

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline

---

## 📊 Database Schema

### Core Models
- **User** - User profiles and authentication
- **Book** - Book metadata and information
- **ReadingHistory** - User reading tracking
- **Review** - User reviews and ratings
- **Achievement** - Gamification achievements
- **BookClub** - Book club management

See [docs/DATABASE.md](docs/DATABASE.md) for complete schema.

---

## 🔐 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt
- **MFA/2FA** - Multi-factor authentication
- **GDPR Compliance** - Data export and deletion
- **Input Validation** - Request sanitization
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request throttling

---

## 📈 Performance

- **API Response Time**: ~100ms average
- **Page Load Time**: ~1.2s
- **Lighthouse Score**: 95+
- **Database Query Time**: ~50ms
- **Cache Hit Rate**: 80%+

---

## 🧪 Testing

### Run Backend Tests
```bash
pytest tests/ -v --cov
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

### Type Checking
```bash
cd frontend
npm run type-check
```

---

## 📚 Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Install development dependencies
pip install -r requirements.txt
npm install --prefix frontend

# Pre-commit hooks
pre-commit install

# Run tests before committing
pytest tests/
cd frontend && npm run lint && npm run type-check
```

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/bookhub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bookhub/discussions)
- **Documentation**: [Full Documentation](docs/)

---

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Powered by [Next.js](https://nextjs.org/)
- UI components from [Lucide Icons](https://lucide.dev/)
- AI features powered by [Google Gemini](https://ai.google.dev/)

---

<div align="center">

**[⬆ back to top](#-bookhub---intelligent-book-recommendation-platform)**

</div>
