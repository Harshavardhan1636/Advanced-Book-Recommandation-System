"""
FastAPI Backend for Book Recommendation System
Provides REST API endpoints for web interface
"""

from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
import os
from datetime import datetime, timedelta

from models.book import Book, BookRecommendation
from models.user import UserProfile, ReadingHistory
from services.api_providers import APIProviderFactory
from services.recommendation_engine import RecommendationEngine
from services.auth import (
    authenticate_user, create_access_token, decode_token,
    Token, User, ACCESS_TOKEN_EXPIRE_MINUTES
)
from services.advanced_features import (
    ReadingTimeCalculator, NaturalLanguageSearch,
    ReadingStreakTracker, PriceComparison, LibraryAvailability
)
from services.gemini_service import gemini_service
from services.cache import cache, cached
from services.personalization import personalization_service
try:
    from services.search_service import search_service
except ImportError:
    search_service = None
from services.integrations import (
    ecommerce_integration, library_integration, ereader_integration,
    goodreads_integration, calendar_integration, email_service
)
from services.api_management import (
    webhook_manager, version_manager, rate_limiter, sdk_generator, graphql_schema
)
from services.security import (
    mfa_service, rbac_service, encryption_service, input_validator,
    gdpr_service, security_headers, Role, Permission
)
from services.innovative_features import (
    ar_preview, ai_cover_generator, reading_companion, movie_matcher,
    translation_service, audiobook_integration, book_club_scheduler, gift_engine
)
from services.gamification import (
    achievement_system, leaderboard_system, streak_tracker, points_system,
    reward_system, competition_system, LeaderboardType
)
from services.analytics import (
    reading_patterns_analyzer, genre_evolution_tracker, predictive_analytics,
    sentiment_tracker, network_analyzer, report_generator, ab_testing_framework,
    behavior_tracker
)
from services.educational_features import (
    book_summary_service, author_profile_service, literary_analysis_service,
    reading_guide_service, book_timeline_service, related_content_service,
    language_learning_service
)
from services.monetization import (
    subscription_service, affiliate_service, sponsored_service,
    api_access_service, white_label_service, SubscriptionTier
)
from services.scalability import (
    message_queue, cdn_service, database_sharding, serverless_service,
    multi_region_service, innovation_pipeline, load_balancer
)
import config

# Setup logging
log_handlers = [logging.StreamHandler()]
try:
    # Ensure log directory exists
    os.makedirs(os.path.dirname(config.LOG_FILE), exist_ok=True)
    log_handlers.append(logging.FileHandler(config.LOG_FILE, mode='a', encoding='utf-8'))
except Exception as e:
    print(f"Warning: Could not create log file: {e}")

logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format=config.LOG_FORMAT,
    handlers=log_handlers
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Book Recommendation System API",
    description="AI-powered book recommendations with ML algorithms",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    headers = security_headers.get_api_security_headers()
    for key, value in headers.items():
        response.headers[key] = value
    return response

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    # Get identifier (user ID, API key, or IP)
    identifier = request.client.host
    
    # Check rate limit
    limit_info = rate_limiter.check_rate_limit(identifier, tier="authenticated")
    
    if not limit_info["allowed"]:
        return HTTPException(
            status_code=429,
            detail="Rate limit exceeded",
            headers={
                "Retry-After": str(limit_info["retry_after"])
            }
        )
    
    response = await call_next(request)
    
    # Add rate limit headers
    rate_headers = rate_limiter.get_rate_limit_headers(identifier)
    for key, value in rate_headers.items():
        response.headers[key] = value
    
    return response

# Initialize services
api_factory = APIProviderFactory()
recommendation_engine = RecommendationEngine(strategy="hybrid")

# Pydantic models for API
class BookResponse(BaseModel):
    title: str
    authors: List[str]
    year: int
    edition_count: int
    cover_id: Optional[int] = None
    subjects: Optional[List[str]] = None
    description: Optional[str] = None
    work_id: Optional[str] = None
    rating: Optional[float] = None
    cover_url: Optional[str] = None
    isbn: Optional[str] = None
    publisher: Optional[str] = None
    language: Optional[str] = None
    page_count: Optional[int] = None
    sentiment_score: Optional[float] = None
    popularity_score: Optional[float] = None

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Search query")
    year_from: Optional[int] = Field(None, ge=1000, le=2100)
    year_to: Optional[int] = Field(None, ge=1000, le=2100)
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    limit: int = Field(20, ge=1, le=100)

class RecommendationRequest(BaseModel):
    target_book_id: str
    limit: int = Field(10, ge=1, le=50)
    context: Optional[Dict] = None

class MoodRecommendationRequest(BaseModel):
    mood: str = Field(..., pattern="^(happy|sad|adventurous|thoughtful|relaxed)$")
    limit: int = Field(10, ge=1, le=50)

class ReadingHistoryRequest(BaseModel):
    book_id: str
    title: str
    authors: List[str]
    rating: Optional[float] = Field(None, ge=0, le=5)
    status: str = Field("read", pattern="^(read|reading|want_to_read)$")
    review: Optional[str] = None
    tags: List[str] = []

class UserProfileResponse(BaseModel):
    user_id: str
    name: str
    reading_history_count: int
    favorite_genres: List[str]
    favorite_authors: List[str]
    average_rating: float
    books_read: int

class RecommendationResponse(BaseModel):
    book: BookResponse
    score: float
    algorithm: str
    reasons: List[str]

# Helper function to convert Book to BookResponse
def book_to_response(book: Book) -> BookResponse:
    return BookResponse(
        title=book.title,
        authors=book.authors,
        year=book.year,
        edition_count=book.edition_count,
        cover_id=book.cover_id,
        subjects=book.subjects,
        description=book.description,
        work_id=book.work_id,
        rating=book.rating,
        cover_url=book.cover_url,
        isbn=book.isbn,
        publisher=book.publisher,
        language=book.language,
        page_count=book.page_count,
        sentiment_score=book.sentiment_score,
        popularity_score=book.popularity_score
    )

# Global user profile (in production, use database)
_user_profile = None

def get_user_profile() -> UserProfile:
    """Get or create user profile"""
    global _user_profile
    if _user_profile is None:
        profile_path = config.DATA_DIR / "user_profile.json"
        _user_profile = UserProfile.load(profile_path)
        if _user_profile is None:
            _user_profile = UserProfile(user_id="default_user", name="Book Lover")
            _user_profile.save(profile_path)
    return _user_profile

def save_user_profile():
    """Save user profile"""
    if _user_profile:
        profile_path = config.DATA_DIR / "user_profile.json"
        _user_profile.save(profile_path)

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Book Recommendation System API",
        "version": "2.0.0",
        "docs": "/api/docs"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api_providers": len(api_factory.providers),
            "recommendation_engine": "operational"
        }
    }

@app.post("/api/books/search", response_model=List[BookResponse])
async def search_books(request: SearchRequest):
    """
    Search for books with filters
    
    - **query**: Search query (required)
    - **year_from**: Filter by minimum year
    - **year_to**: Filter by maximum year
    - **min_rating**: Filter by minimum rating
    - **limit**: Number of results (default: 20)
    """
    try:
        logger.info(f"Search request: {request.query}")
        
        filters = {}
        if request.year_from:
            filters['year_from'] = request.year_from
        if request.year_to:
            filters['year_to'] = request.year_to
        if request.min_rating:
            filters['min_rating'] = request.min_rating
        
        books = api_factory.search_books(
            query=request.query,
            filters=filters if filters else None,
            limit=request.limit
        )
        
        if not books:
            return []
        
        return [book_to_response(book) for book in books]
        
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/books/trending", response_model=List[RecommendationResponse])
async def get_trending_books(
    time_window: str = Query("recent", pattern="^(recent|this_year|classic)$"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Get trending books
    
    - **time_window**: recent, this_year, or classic
    - **limit**: Number of results
    """
    try:
        # Get popular books
        query = "bestseller" if time_window == "recent" else "classic literature"
        candidates = api_factory.search_books(query, limit=50)
        
        recommendations = recommendation_engine.get_trending_recommendations(
            candidates=candidates,
            time_window=time_window,
            top_n=limit
        )
        
        return [
            RecommendationResponse(
                book=book_to_response(rec.book),
                score=rec.score,
                algorithm=rec.algorithm,
                reasons=rec.reasons
            )
            for rec in recommendations
        ]
        
    except Exception as e:
        logger.error(f"Trending books failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations/ml", response_model=List[RecommendationResponse])
async def get_ml_recommendations(request: RecommendationRequest):
    """
    Get ML-powered recommendations based on a target book
    
    - **target_book_id**: ID of the book to base recommendations on
    - **limit**: Number of recommendations
    - **context**: Optional context (time_of_day, reading_goal, etc.)
    """
    try:
        user_profile = get_user_profile()
        
        # Search for the target book and candidates
        # In production, fetch from database
        query = request.target_book_id
        all_books = api_factory.search_books(query, limit=50)
        
        if not all_books:
            raise HTTPException(status_code=404, detail="Target book not found")
        
        target_book = all_books[0]
        candidates = all_books[1:]
        
        recommendations = recommendation_engine.get_recommendations(
            target_book=target_book,
            candidates=candidates,
            user_profile=user_profile,
            context=request.context,
            top_n=request.limit
        )
        
        return [
            RecommendationResponse(
                book=book_to_response(rec.book),
                score=rec.score,
                algorithm=rec.algorithm,
                reasons=rec.reasons
            )
            for rec in recommendations
        ]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"ML recommendations failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations/mood", response_model=List[RecommendationResponse])
async def get_mood_recommendations(request: MoodRecommendationRequest):
    """
    Get mood-based recommendations
    
    - **mood**: happy, sad, adventurous, thoughtful, or relaxed
    - **limit**: Number of recommendations
    """
    try:
        # Get diverse books
        candidates = api_factory.search_books("fiction", limit=50)
        
        recommendations = recommendation_engine.get_mood_based_recommendations(
            candidates=candidates,
            mood=request.mood,
            top_n=request.limit
        )
        
        return [
            RecommendationResponse(
                book=book_to_response(rec.book),
                score=rec.score,
                algorithm=rec.algorithm,
                reasons=rec.reasons
            )
            for rec in recommendations
        ]
        
    except Exception as e:
        logger.error(f"Mood recommendations failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/profile", response_model=UserProfileResponse)
async def get_profile():
    """Get user profile"""
    try:
        profile = get_user_profile()
        
        return UserProfileResponse(
            user_id=profile.user_id,
            name=profile.name,
            reading_history_count=len(profile.reading_history),
            favorite_genres=profile.favorite_genres,
            favorite_authors=profile.favorite_authors,
            average_rating=profile.get_average_rating(),
            books_read=profile.get_read_books_count()
        )
        
    except Exception as e:
        logger.error(f"Get profile failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/user/history")
async def add_to_history(request: ReadingHistoryRequest):
    """Add book to reading history"""
    try:
        profile = get_user_profile()
        
        history_entry = ReadingHistory(
            book_id=request.book_id,
            title=request.title,
            authors=request.authors,
            rating=request.rating,
            read_date=datetime.now().isoformat(),
            status=request.status,
            review=request.review,
            tags=request.tags
        )
        
        profile.add_to_history(history_entry)
        save_user_profile()
        
        return {"message": "Added to reading history", "success": True}
        
    except Exception as e:
        logger.error(f"Add to history failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/history")
async def get_reading_history():
    """Get reading history"""
    try:
        profile = get_user_profile()
        return {
            "history": [entry.to_dict() for entry in profile.reading_history],
            "count": len(profile.reading_history)
        }
        
    except Exception as e:
        logger.error(f"Get history failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/stats")
async def get_statistics():
    """Get reading statistics"""
    try:
        profile = get_user_profile()
        
        # Calculate statistics
        total_books = len(profile.reading_history)
        books_read = profile.get_read_books_count()
        average_rating = profile.get_average_rating()
        
        # Genre distribution
        genre_counts = {}
        for entry in profile.reading_history:
            for tag in entry.tags:
                genre_counts[tag] = genre_counts.get(tag, 0) + 1
        
        top_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            "total_books": total_books,
            "books_read": books_read,
            "average_rating": average_rating,
            "favorite_authors": profile.favorite_authors[:10],
            "favorite_genres": profile.favorite_genres[:10],
            "genre_distribution": [{"genre": g, "count": c} for g, c in top_genres]
        }
        
    except Exception as e:
        logger.error(f"Get statistics failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Authentication endpoints
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint - returns JWT token"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=User)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current authenticated user"""
    token_data = decode_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return User(username=token_data.username, email="user@example.com", full_name="User")

# Advanced features endpoints

@app.get("/api/books/{book_id}/reading-time")
async def get_reading_time(
    book_id: str,
    speed: str = Query("average", pattern="^(slow|average|fast)$")
):
    """Calculate estimated reading time for a book"""
    try:
        # Get book details (mock - in production, fetch from database)
        # For demo, using page count from query
        page_count = 300  # Mock value
        
        reading_time = ReadingTimeCalculator.calculate_reading_time(page_count, speed)
        daily_goal = ReadingTimeCalculator.calculate_daily_reading_goal(page_count, 7, speed)
        
        return {
            "page_count": page_count,
            "reading_time": reading_time,
            "weekly_goal": daily_goal
        }
    except Exception as e:
        logger.error(f"Reading time calculation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search/natural-language")
async def natural_language_search(query: str = Query(..., min_length=3)):
    """
    Natural language search with mood and comparison understanding
    
    Examples:
    - "books like Harry Potter but darker"
    - "funny science fiction"
    - "relaxing mystery novels"
    """
    try:
        # Parse natural language query
        parsed = NaturalLanguageSearch.parse_query(query)
        
        # Search with base query
        base_query = parsed['base_query']
        books = api_factory.search_books(base_query, limit=50)
        
        # Enhance results based on parsed query
        if parsed['mood'] or parsed['modifiers']:
            books = NaturalLanguageSearch.enhance_search_results(books, parsed)
        
        return {
            "parsed_query": parsed,
            "results": [book_to_response(book) for book in books[:20]]
        }
        
    except Exception as e:
        logger.error(f"Natural language search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/streak")
async def get_reading_streak():
    """Get user's reading streak and habits"""
    try:
        profile = get_user_profile()
        
        streak = ReadingStreakTracker.calculate_streak(profile)
        habits = ReadingStreakTracker.get_reading_habits(profile)
        
        return {
            "streak": streak,
            "habits": habits
        }
        
    except Exception as e:
        logger.error(f"Get streak failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/books/{isbn}/prices")
async def get_book_prices(isbn: str):
    """Get price comparison for a book"""
    try:
        prices = PriceComparison.get_prices(isbn)
        best_price = PriceComparison.get_best_price(isbn)
        
        return {
            "isbn": isbn,
            "prices": prices,
            "best_price": best_price
        }
        
    except Exception as e:
        logger.error(f"Price comparison failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/books/{isbn}/library-availability")
async def check_library_availability(
    isbn: str,
    zip_code: Optional[str] = Query(None)
):
    """Check library availability for a book"""
    try:
        availability = LibraryAvailability.check_availability(isbn, zip_code)
        
        return availability
        
    except Exception as e:
        logger.error(f"Library check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/year-review")
async def get_year_review(year: int = Query(datetime.now().year)):
    """Get year in review report"""
    try:
        profile = get_user_profile()
        
        # Filter books read in specified year
        year_books = [
            entry for entry in profile.reading_history
            if entry.read_date and datetime.fromisoformat(entry.read_date).year == year
        ]
        
        # Calculate statistics
        total_books = len(year_books)
        total_pages = sum(300 for _ in year_books)  # Mock page count
        
        # Genre breakdown
        genre_counts = {}
        for entry in year_books:
            for tag in entry.tags:
                genre_counts[tag] = genre_counts.get(tag, 0) + 1
        
        top_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Average rating
        ratings = [entry.rating for entry in year_books if entry.rating]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        
        return {
            "year": year,
            "total_books": total_books,
            "total_pages": total_pages,
            "average_rating": round(avg_rating, 2),
            "top_genres": [{"genre": g, "count": c} for g, c in top_genres],
            "reading_goal_progress": {
                "target": 52,  # Mock goal
                "achieved": total_books,
                "percentage": round((total_books / 52) * 100, 1) if total_books else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Year review failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Gemini AI endpoints

@app.post("/api/ai/summary")
async def generate_book_summary(
    book_id: str,
    length: str = Query("medium", pattern="^(short|medium|long)$")
):
    """
    Generate AI-powered book summary using Gemini
    
    Args:
        book_id: Book identifier
        length: Summary length (short/medium/long)
    """
    try:
        # Get book details (simplified - in production, fetch from database)
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        book = books[0]
        summary = gemini_service.generate_summary(book, length=length)
        
        return {
            "book_id": book_id,
            "title": book.title,
            "summary": summary,
            "length": length
        }
        
    except Exception as e:
        logger.error(f"Summary generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/qa")
async def ask_about_book(
    book_id: str,
    question: str = Query(..., min_length=3)
):
    """
    Ask questions about a book using Gemini AI
    
    Args:
        book_id: Book identifier
        question: Question about the book
    """
    try:
        # Get book details
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        book = books[0]
        answer = gemini_service.answer_question(book, question)
        
        return {
            "book_id": book_id,
            "question": question,
            "answer": answer
        }
        
    except Exception as e:
        logger.error(f"Q&A failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/reading-list")
async def generate_ai_reading_list(
    mood: str = Query(..., min_length=3),
    count: int = Query(10, ge=1, le=20)
):
    """
    Generate AI-powered reading list based on mood
    
    Args:
        mood: Current mood (e.g., "happy", "thoughtful", "adventurous")
        count: Number of book suggestions
    """
    try:
        profile = get_user_profile()
        
        preferences = {
            "genres": profile.favorite_genres[:5],
            "authors": profile.favorite_authors[:5]
        }
        
        suggestions = gemini_service.generate_reading_list(mood, preferences, count)
        
        return {
            "mood": mood,
            "suggestions": suggestions,
            "count": len(suggestions)
        }
        
    except Exception as e:
        logger.error(f"AI reading list generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/compare")
async def compare_books_ai(
    book_id_1: str,
    book_id_2: str
):
    """
    Compare two books using Gemini AI
    
    Args:
        book_id_1: First book identifier
        book_id_2: Second book identifier
    """
    try:
        # Get both books
        books1 = api_factory.search_books(book_id_1, limit=1)
        books2 = api_factory.search_books(book_id_2, limit=1)
        
        if not books1 or not books2:
            raise HTTPException(status_code=404, detail="One or both books not found")
        
        comparison = gemini_service.compare_books(books1[0], books2[0])
        
        return comparison
        
    except Exception as e:
        logger.error(f"Book comparison failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Personalization endpoints

@app.get("/api/personalization/preferences")
async def get_user_preferences():
    """Get calculated user preferences"""
    try:
        profile = get_user_profile()
        preferences = personalization_service.calculate_user_preferences(profile)
        
        return {
            "user_id": profile.user_id,
            "preferences": preferences
        }
        
    except Exception as e:
        logger.error(f"Get preferences failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/personalization/filter")
async def smart_filter_books(
    query: str = Query(..., min_length=1),
    genres: Optional[List[str]] = None,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    rating_min: Optional[float] = None,
    length: Optional[str] = Query(None, pattern="^(short|medium|long)$"),
    difficulty: Optional[str] = Query(None, pattern="^(easy|medium|hard)$"),
    mood: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100)
):
    """
    Smart filtering with multiple dimensions
    
    Args:
        query: Search query
        genres: List of genres to filter by
        year_min: Minimum publication year
        year_max: Maximum publication year
        rating_min: Minimum rating
        length: Book length (short/medium/long)
        difficulty: Reading difficulty (easy/medium/hard)
        mood: Mood-based filtering
        limit: Number of results
    """
    try:
        # Search books
        books = api_factory.search_books(query, limit=limit * 2)
        
        # Build filters
        filters = {}
        if genres:
            filters["genres"] = genres
        if year_min:
            filters["year_min"] = year_min
        if year_max:
            filters["year_max"] = year_max
        if rating_min:
            filters["rating_min"] = rating_min
        if length:
            filters["length"] = length
        if difficulty:
            filters["difficulty"] = difficulty
        if mood:
            filters["mood"] = mood
        
        # Apply smart filters
        profile = get_user_profile()
        user_prefs = personalization_service.calculate_user_preferences(profile)
        
        filtered_books = personalization_service.smart_filter(books, filters, user_prefs)
        
        # Sort by custom preferences
        sorted_books = personalization_service.custom_sort(
            filtered_books[:limit],
            sort_by="custom",
            user_preferences=user_prefs
        )
        
        return {
            "query": query,
            "filters_applied": filters,
            "total_results": len(sorted_books),
            "results": [book_to_response(book) for book in sorted_books]
        }
        
    except Exception as e:
        logger.error(f"Smart filter failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/personalization/reading-goals")
async def get_reading_goals():
    """Get reading goals and progress"""
    try:
        profile = get_user_profile()
        goals = personalization_service.get_reading_goals(profile)
        
        return goals
        
    except Exception as e:
        logger.error(f"Get reading goals failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/personalization/when-to-read")
async def recommend_when_to_read(book_id: str):
    """Get recommendation for when to read a book"""
    try:
        # Get book
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        book = books[0]
        profile = get_user_profile()
        user_prefs = personalization_service.calculate_user_preferences(profile)
        
        recommendation = personalization_service.recommend_when_to_read(book, user_prefs)
        
        return {
            "book_id": book_id,
            "title": book.title,
            "recommendation": recommendation
        }
        
    except Exception as e:
        logger.error(f"When to read recommendation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/personalization/similar-users")
async def find_similar_users(limit: int = Query(10, ge=1, le=50)):
    """Find users with similar reading tastes"""
    try:
        profile = get_user_profile()
        
        # In production, fetch all user profiles from database
        # For now, return mock data
        similar_users = []
        
        return {
            "user_id": profile.user_id,
            "similar_users": similar_users,
            "count": len(similar_users)
        }
        
    except Exception as e:
        logger.error(f"Find similar users failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Elasticsearch search endpoint (if available)

if search_service and search_service.available:
    @app.post("/api/search/fulltext")
    async def fulltext_search(
        query: str = Query(..., min_length=1),
        year_min: Optional[int] = None,
        year_max: Optional[int] = None,
        rating_min: Optional[float] = None,
        limit: int = Query(20, ge=1, le=100),
        offset: int = Query(0, ge=0)
    ):
        """
        Full-text search using Elasticsearch
        
        Args:
            query: Search query
            year_min: Minimum publication year
            year_max: Maximum publication year
            rating_min: Minimum rating
            limit: Number of results
            offset: Pagination offset
        """
        try:
            filters = {}
            if year_min:
                filters["year_min"] = year_min
            if year_max:
                filters["year_max"] = year_max
            if rating_min:
                filters["rating_min"] = rating_min
            
            results = search_service.search(query, filters, limit, offset)
            
            return {
                "query": query,
                "total_results": len(results),
                "offset": offset,
                "limit": limit,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Fulltext search failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/search/suggest")
    async def search_suggestions(
        query: str = Query(..., min_length=1),
        limit: int = Query(5, ge=1, le=10)
    ):
        """Get search suggestions/autocomplete"""
        try:
            suggestions = search_service.suggest(query, limit)
            
            return {
                "query": query,
                "suggestions": suggestions
            }
            
        except Exception as e:
            logger.error(f"Search suggestions failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# INTEGRATION ENDPOINTS
# ============================================================================

@app.get("/api/integrations/purchase-links/{book_id}")
async def get_purchase_links(book_id: str):
    """Get e-commerce purchase links for a book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        links = ecommerce_integration.get_all_purchase_links(books[0])
        
        return {
            "book_id": book_id,
            "title": books[0].title,
            "purchase_links": links
        }
    except Exception as e:
        logger.error(f"Get purchase links failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/integrations/library-availability/{isbn}")
async def check_library(isbn: str, zip_code: Optional[str] = None):
    """Check library availability via OverDrive"""
    try:
        availability = library_integration.check_overdrive_availability(isbn)
        
        if zip_code:
            nearby_libraries = library_integration.find_nearby_libraries(zip_code)
            availability["nearby_libraries"] = nearby_libraries
        
        return availability
    except Exception as e:
        logger.error(f"Library check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/integrations/send-to-kindle")
async def send_to_kindle(book_id: str, kindle_email: str):
    """Send book to Kindle device"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        result = ereader_integration.send_to_kindle(books[0], kindle_email)
        return result
    except Exception as e:
        logger.error(f"Send to Kindle failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/integrations/goodreads-import")
async def import_goodreads(goodreads_user_id: str):
    """Import reading history from Goodreads"""
    try:
        result = goodreads_integration.import_reading_history(goodreads_user_id)
        return result
    except Exception as e:
        logger.error(f"Goodreads import failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/integrations/reading-schedule")
async def create_reading_schedule(
    book_id: str,
    start_date: str,
    pages_per_day: int = 50
):
    """Create reading schedule in calendar"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        start = datetime.fromisoformat(start_date)
        schedule = calendar_integration.create_reading_schedule(
            books[0], start, pages_per_day
        )
        
        return schedule
    except Exception as e:
        logger.error(f"Create schedule failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/integrations/send-recommendations-email")
async def send_recommendations_email(
    to_email: str,
    user_name: str = "Reader"
):
    """Send personalized recommendation email"""
    try:
        # Get recommendations
        profile = get_user_profile()
        books = api_factory.search_books("fiction", limit=5)
        
        result = email_service.send_recommendation_email(to_email, books, user_name)
        return result
    except Exception as e:
        logger.error(f"Send email failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# API MANAGEMENT ENDPOINTS
# ============================================================================

@app.post("/api/webhooks/register")
async def register_webhook(
    event_type: str,
    url: str,
    secret: Optional[str] = None
):
    """Register a webhook for event notifications"""
    try:
        webhook_id = webhook_manager.register_webhook(event_type, url, secret)
        
        return {
            "webhook_id": webhook_id,
            "event_type": event_type,
            "url": url,
            "status": "registered"
        }
    except Exception as e:
        logger.error(f"Webhook registration failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/webhooks")
async def list_webhooks(event_type: Optional[str] = None):
    """List registered webhooks"""
    try:
        webhooks = webhook_manager.list_webhooks(event_type)
        return {"webhooks": webhooks}
    except Exception as e:
        logger.error(f"List webhooks failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/webhooks/{webhook_id}")
async def unregister_webhook(webhook_id: str):
    """Unregister a webhook"""
    try:
        success = webhook_manager.unregister_webhook(webhook_id)
        if not success:
            raise HTTPException(status_code=404, detail="Webhook not found")
        
        return {"status": "unregistered", "webhook_id": webhook_id}
    except Exception as e:
        logger.error(f"Webhook unregistration failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sdk/python")
async def get_python_sdk():
    """Download Python SDK client"""
    try:
        code = sdk_generator.generate_python_client()
        return {
            "language": "python",
            "code": code,
            "filename": "bookrec_client.py"
        }
    except Exception as e:
        logger.error(f"SDK generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sdk/javascript")
async def get_javascript_sdk():
    """Download JavaScript SDK client"""
    try:
        code = sdk_generator.generate_javascript_client()
        return {
            "language": "javascript",
            "code": code,
            "filename": "bookrec-client.js"
        }
    except Exception as e:
        logger.error(f"SDK generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# GraphQL endpoint (if available)
if graphql_schema:
    from strawberry.fastapi import GraphQLRouter
    graphql_app = GraphQLRouter(graphql_schema)
    app.include_router(graphql_app, prefix="/api/graphql")

# ============================================================================
# SECURITY ENDPOINTS
# ============================================================================

@app.post("/api/security/mfa/setup")
async def setup_mfa(user_email: str):
    """Setup multi-factor authentication"""
    try:
        mfa_data = mfa_service.generate_secret(user_email)
        return mfa_data
    except Exception as e:
        logger.error(f"MFA setup failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/security/mfa/verify")
async def verify_mfa(secret: str, token: str):
    """Verify MFA token"""
    try:
        valid = mfa_service.verify_totp(secret, token)
        return {"valid": valid}
    except Exception as e:
        logger.error(f"MFA verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/security/mfa/backup-codes")
async def generate_backup_codes():
    """Generate MFA backup codes"""
    try:
        codes = mfa_service.generate_backup_codes()
        return {"backup_codes": codes}
    except Exception as e:
        logger.error(f"Backup code generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/security/permissions")
async def get_user_permissions(role: str = "user"):
    """Get permissions for a role"""
    try:
        user_role = Role(role)
        permissions = rbac_service.get_role_permissions(user_role)
        
        return {
            "role": role,
            "permissions": [p.value for p in permissions]
        }
    except Exception as e:
        logger.error(f"Get permissions failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/security/validate-input")
async def validate_input(text: str, max_length: int = 1000):
    """Validate and sanitize user input"""
    try:
        sanitized = input_validator.validate_and_sanitize(text, max_length)
        
        if sanitized is None:
            return {
                "valid": False,
                "message": "Input contains potentially malicious content"
            }
        
        return {
            "valid": True,
            "sanitized": sanitized
        }
    except Exception as e:
        logger.error(f"Input validation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# GDPR Compliance endpoints

@app.get("/api/gdpr/export-data")
async def export_user_data(user_id: int):
    """Export all user data (GDPR compliance)"""
    try:
        data = gdpr_service.export_user_data(user_id)
        return data
    except Exception as e:
        logger.error(f"Data export failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gdpr/delete-data")
async def delete_user_data(user_id: int):
    """Delete all user data (GDPR right to erasure)"""
    try:
        success = gdpr_service.delete_user_data(user_id)
        return {"status": "deleted" if success else "failed"}
    except Exception as e:
        logger.error(f"Data deletion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/gdpr/consent")
async def get_consent_status(user_id: int):
    """Get user consent status"""
    try:
        consent = gdpr_service.get_consent_status(user_id)
        return {"user_id": user_id, "consent": consent}
    except Exception as e:
        logger.error(f"Get consent failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gdpr/consent")
async def update_consent(
    user_id: int,
    consent_type: str,
    granted: bool
):
    """Update user consent"""
    try:
        success = gdpr_service.update_consent(user_id, consent_type, granted)
        return {"status": "updated" if success else "failed"}
    except Exception as e:
        logger.error(f"Update consent failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# INNOVATIVE FEATURES ENDPOINTS
# ============================================================================

@app.get("/api/innovative/ar-preview/{book_id}")
async def get_ar_preview(book_id: str):
    """Get AR preview configuration for a book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        ar_data = ar_preview.generate_ar_marker(books[0])
        viewer_config = ar_preview.get_ar_viewer_config(books[0])
        
        return {
            "ar_marker": ar_data,
            "viewer_config": viewer_config
        }
    except Exception as e:
        logger.error(f"AR preview failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/innovative/generate-cover")
async def generate_ai_cover(
    book_id: str,
    style: str = "modern",
    color_scheme: str = "vibrant"
):
    """Generate AI-powered custom book cover"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        cover = ai_cover_generator.generate_cover(books[0], style, color_scheme)
        return cover
    except Exception as e:
        logger.error(f"Cover generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/innovative/reading-companion/chat")
async def chat_with_companion(
    user_id: int,
    book_id: str,
    message: str
):
    """Chat with AI reading companion about a book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        response = reading_companion.chat(user_id, books[0], message)
        prompts = reading_companion.get_discussion_prompts(books[0])
        
        return {
            "response": response,
            "suggested_prompts": prompts
        }
    except Exception as e:
        logger.error(f"Reading companion chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/innovative/movie-adaptations/{book_id}")
async def find_movie_adaptations(book_id: str):
    """Find movie/TV adaptations of a book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        adaptations = movie_matcher.find_adaptations(books[0])
        return {"book_id": book_id, "adaptations": adaptations}
    except Exception as e:
        logger.error(f"Movie adaptation search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/innovative/translate")
async def translate_text(
    text: str,
    target_language: str,
    source_language: str = "en"
):
    """Translate text to target language"""
    try:
        translated = translation_service.translate_text(text, target_language, source_language)
        return {"translated_text": translated, "target_language": target_language}
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/innovative/audiobook/{book_id}")
async def find_audiobook(book_id: str):
    """Find audiobook version of a book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        audiobook = audiobook_integration.find_audiobook(books[0])
        return audiobook
    except Exception as e:
        logger.error(f"Audiobook search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/innovative/book-club/schedule")
async def create_book_club_schedule(
    book_id: str,
    club_members: int,
    start_date: str,
    frequency: str = "weekly"
):
    """Create reading schedule for book club"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        start = datetime.fromisoformat(start_date)
        schedule = book_club_scheduler.create_reading_schedule(
            books[0], club_members, start, frequency
        )
        
        return schedule
    except Exception as e:
        logger.error(f"Schedule creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/innovative/gift-recommendations")
async def get_gift_recommendations(
    recipient_profile: Dict[str, Any],
    occasion: str,
    budget: float
):
    """Get AI-powered gift recommendations"""
    try:
        recommendations = gift_engine.recommend_gift(recipient_profile, occasion, budget)
        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Gift recommendations failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# GAMIFICATION ENDPOINTS
# ============================================================================

@app.get("/api/gamification/achievements")
async def get_achievements(user_id: int):
    """Get user's achievements"""
    try:
        # Mock user stats
        user_stats = {
            "books_read": 25,
            "streak_days": 15,
            "reviews_written": 10,
            "clubs_joined": 3,
            "unique_genres": 8
        }
        
        earned = achievement_system.check_achievements(user_id, user_stats)
        all_achievements = list(achievement_system.achievements.values())
        
        return {
            "earned_achievements": [
                {
                    "id": a.id,
                    "name": a.name,
                    "description": a.description,
                    "points": a.points,
                    "icon": a.icon
                }
                for a in earned
            ],
            "total_achievements": len(all_achievements),
            "completion_percentage": round((len(earned) / len(all_achievements)) * 100, 1)
        }
    except Exception as e:
        logger.error(f"Get achievements failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/gamification/leaderboard/{leaderboard_type}")
async def get_leaderboard(leaderboard_type: str, limit: int = 10):
    """Get leaderboard rankings"""
    try:
        lb_type = LeaderboardType(leaderboard_type)
        leaderboard = leaderboard_system.get_leaderboard(lb_type, limit)
        
        return {
            "leaderboard_type": leaderboard_type,
            "rankings": leaderboard
        }
    except Exception as e:
        logger.error(f"Get leaderboard failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/gamification/streak/{user_id}")
async def get_user_streak(user_id: int):
    """Get user's reading streak"""
    try:
        streak = streak_tracker.get_streak(user_id)
        return streak
    except Exception as e:
        logger.error(f"Get streak failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gamification/record-activity")
async def record_reading_activity(user_id: int):
    """Record reading activity for streak"""
    try:
        streak_tracker.record_activity(user_id, datetime.now())
        points = points_system.award_points(user_id, "book_read")
        
        return {
            "streak_updated": True,
            "points_earned": points,
            "total_points": points_system.get_points(user_id)
        }
    except Exception as e:
        logger.error(f"Record activity failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/gamification/points/{user_id}")
async def get_user_points(user_id: int):
    """Get user's points"""
    try:
        total_points = points_system.get_points(user_id)
        history = points_system.get_point_history(user_id)
        
        return {
            "total_points": total_points,
            "recent_history": history
        }
    except Exception as e:
        logger.error(f"Get points failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gamification/unlock-reward")
async def unlock_reward(user_id: int, reward_id: str):
    """Unlock a virtual reward"""
    try:
        result = reward_system.unlock_reward(user_id, reward_id, points_system)
        return result
    except Exception as e:
        logger.error(f"Unlock reward failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/gamification/rewards/{user_id}")
async def get_unlocked_rewards(user_id: int):
    """Get user's unlocked rewards"""
    try:
        rewards = reward_system.get_unlocked_rewards(user_id)
        
        return {
            "unlocked_rewards": [
                {
                    "id": r.id,
                    "name": r.name,
                    "type": r.reward_type.value,
                    "icon": r.icon
                }
                for r in rewards
            ]
        }
    except Exception as e:
        logger.error(f"Get rewards failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gamification/competition/create")
async def create_competition(
    name: str,
    description: str,
    duration_days: int,
    goal_type: str,
    goal_value: int
):
    """Create a reading competition"""
    try:
        competition = competition_system.create_competition(
            name, description, duration_days, goal_type, goal_value
        )
        
        return {
            "competition_id": competition.id,
            "name": competition.name,
            "start_date": competition.start_date.isoformat(),
            "end_date": competition.end_date.isoformat()
        }
    except Exception as e:
        logger.error(f"Create competition failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ANALYTICS ENDPOINTS
# ============================================================================

@app.get("/api/analytics/reading-patterns/{user_id}")
async def get_reading_patterns(user_id: int):
    """Get reading pattern analysis"""
    try:
        # Mock reading sessions
        sessions = [
            {"timestamp": datetime.now().isoformat(), "duration_minutes": 45},
            {"timestamp": (datetime.now() - timedelta(days=1)).isoformat(), "duration_minutes": 30}
        ]
        
        patterns = reading_patterns_analyzer.analyze_time_patterns(sessions)
        return patterns
    except Exception as e:
        logger.error(f"Reading patterns analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/genre-evolution/{user_id}")
async def get_genre_evolution(user_id: int):
    """Track genre preference evolution"""
    try:
        # Mock reading history
        history = []
        
        evolution = genre_evolution_tracker.track_genre_evolution(history)
        return evolution
    except Exception as e:
        logger.error(f"Genre evolution tracking failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/predict-next-book")
async def predict_next_book(
    current_book_id: str,
    user_id: int
):
    """Predict next book recommendations"""
    try:
        books = api_factory.search_books(current_book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        current_book = {"title": books[0].title, "genres": books[0].subjects or []}
        history = []
        available = api_factory.search_books("fiction", limit=20)
        available_dicts = [{"title": b.title, "genres": b.subjects or [], "rating": b.rating} for b in available]
        
        predictions = predictive_analytics.predict_next_book(current_book, history, available_dicts)
        
        return {"predictions": predictions[:5]}
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/mood-correlation/{user_id}")
async def get_mood_correlation(user_id: int):
    """Get mood-genre correlation analysis"""
    try:
        # Mock sessions
        sessions = []
        
        correlation = sentiment_tracker.track_mood_genre_correlation(sessions)
        return correlation
    except Exception as e:
        logger.error(f"Mood correlation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/author-network/{user_id}")
async def get_author_network(user_id: int):
    """Get author/genre network graph"""
    try:
        # Mock history
        history = []
        
        network = network_analyzer.build_author_network(history)
        return network
    except Exception as e:
        logger.error(f"Network analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/report/{user_id}")
async def generate_report(user_id: int, format: str = "json"):
    """Generate comprehensive reading report"""
    try:
        user_data = {
            "user_id": user_id,
            "reading_history": [],
            "achievements": [],
            "streak": 0,
            "points": 0
        }
        
        report = report_generator.generate_reading_report(user_data, format)
        return report
    except Exception as e:
        logger.error(f"Report generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/ab-test/create")
async def create_ab_test(
    name: str,
    variants: List[str],
    traffic_split: List[float]
):
    """Create A/B test experiment"""
    try:
        experiment_id = ab_testing_framework.create_experiment(name, variants, traffic_split)
        
        return {
            "experiment_id": experiment_id,
            "name": name,
            "variants": variants
        }
    except Exception as e:
        logger.error(f"A/B test creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/ab-test/{experiment_id}/results")
async def get_ab_test_results(experiment_id: str):
    """Get A/B test results"""
    try:
        results = ab_testing_framework.get_results(experiment_id)
        return results
    except Exception as e:
        logger.error(f"Get A/B test results failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/track-event")
async def track_user_event(
    session_id: str,
    event_type: str,
    event_data: Dict[str, Any]
):
    """Track user behavior event"""
    try:
        behavior_tracker.track_event(session_id, event_type, event_data)
        return {"status": "tracked"}
    except Exception as e:
        logger.error(f"Event tracking failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/heatmap/{page}")
async def get_heatmap(page: str):
    """Get heatmap data for a page"""
    try:
        heatmap = behavior_tracker.get_heatmap_data(page)
        return heatmap
    except Exception as e:
        logger.error(f"Heatmap retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# EDUCATIONAL FEATURES ENDPOINTS
# ============================================================================

@app.get("/api/educational/summary/{book_id}")
async def get_book_summary(book_id: str, summary_type: str = "comprehensive"):
    """Get AI-generated book summary"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        summary = book_summary_service.generate_summary(books[0], summary_type)
        return summary
    except Exception as e:
        logger.error(f"Summary generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/educational/author/{author_name}")
async def get_author_profile(author_name: str):
    """Get comprehensive author profile"""
    try:
        profile = author_profile_service.get_author_profile(author_name)
        return profile
    except Exception as e:
        logger.error(f"Author profile retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/educational/analysis/{book_id}")
async def get_literary_analysis(book_id: str):
    """Get literary analysis of a book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        analysis = literary_analysis_service.analyze_book(books[0])
        return analysis
    except Exception as e:
        logger.error(f"Literary analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/educational/reading-guide/{book_id}")
async def get_reading_guide(book_id: str, audience: str = "general"):
    """Get reading guide with discussion questions"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        guide = reading_guide_service.generate_reading_guide(books[0], audience)
        return guide
    except Exception as e:
        logger.error(f"Reading guide generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/educational/timeline/{book_id}")
async def get_book_timeline(book_id: str):
    """Get historical timeline for book"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        timeline = book_timeline_service.create_timeline(books[0])
        return timeline
    except Exception as e:
        logger.error(f"Timeline creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/educational/related-content/{book_id}")
async def get_related_content(book_id: str):
    """Get related podcasts, videos, articles"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        content = related_content_service.find_related_content(books[0])
        return content
    except Exception as e:
        logger.error(f"Related content search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/educational/vocabulary/{book_id}")
async def get_vocabulary(book_id: str, difficulty: str = "intermediate"):
    """Get vocabulary for language learning"""
    try:
        books = api_factory.search_books(book_id, limit=1)
        if not books:
            raise HTTPException(status_code=404, detail="Book not found")
        
        vocabulary = language_learning_service.extract_vocabulary(books[0], difficulty)
        return vocabulary
    except Exception as e:
        logger.error(f"Vocabulary extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# MONETIZATION ENDPOINTS
# ============================================================================

@app.get("/api/subscription/tiers")
async def get_subscription_tiers():
    """Get all subscription tiers"""
    try:
        tiers = {
            tier.value: subscription_service.get_tier_info(tier)
            for tier in SubscriptionTier
        }
        return {"tiers": tiers}
    except Exception as e:
        logger.error(f"Get tiers failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/subscription/subscribe")
async def subscribe_user(
    user_id: int,
    tier: str,
    payment_method: str
):
    """Subscribe user to a tier"""
    try:
        subscription_tier = SubscriptionTier(tier)
        subscription = subscription_service.subscribe(user_id, subscription_tier, payment_method)
        return subscription
    except Exception as e:
        logger.error(f"Subscription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/affiliate/link")
async def generate_affiliate_link(
    book_id: str,
    retailer: str,
    affiliate_id: str
):
    """Generate affiliate link"""
    try:
        link = affiliate_service.generate_affiliate_link(book_id, retailer, affiliate_id)
        return {"affiliate_link": link}
    except Exception as e:
        logger.error(f"Affiliate link generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/affiliate/stats/{affiliate_id}")
async def get_affiliate_stats(affiliate_id: str):
    """Get affiliate statistics"""
    try:
        stats = affiliate_service.get_affiliate_stats(affiliate_id)
        return stats
    except Exception as e:
        logger.error(f"Get affiliate stats failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/api-access/generate-key")
async def generate_api_key(user_id: int, tier: str = "free"):
    """Generate API key for developer"""
    try:
        key_data = api_access_service.generate_api_key(user_id, tier)
        return key_data
    except Exception as e:
        logger.error(f"API key generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/white-label/create")
async def create_white_label(
    client_name: str,
    domain: str,
    customization: Dict[str, Any]
):
    """Create white-label instance"""
    try:
        instance = white_label_service.create_white_label_instance(
            client_name, domain, customization
        )
        return instance
    except Exception as e:
        logger.error(f"White-label creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# SCALABILITY ENDPOINTS
# ============================================================================

@app.get("/api/scalability/regions")
async def get_regions():
    """Get multi-region deployment status"""
    try:
        regions = multi_region_service.get_region_status()
        return {"regions": regions}
    except Exception as e:
        logger.error(f"Get regions failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scalability/cdn-stats")
async def get_cdn_stats():
    """Get CDN statistics"""
    try:
        stats = cdn_service.get_cache_stats()
        return stats
    except Exception as e:
        logger.error(f"Get CDN stats failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scalability/innovations")
async def get_innovations():
    """Get innovation pipeline features"""
    try:
        innovations = innovation_pipeline.get_all_innovations()
        return innovations
    except Exception as e:
        logger.error(f"Get innovations failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scalability/shards")
async def get_shard_info():
    """Get database sharding information"""
    try:
        shards = {
            "shard_count": database_sharding.shard_count,
            "shards": list(database_sharding.shards.values())
        }
        return shards
    except Exception as e:
        logger.error(f"Get shard info failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
if __name__ == "__main__":
    import uvicorn
    
    logger.info("="*60)
    logger.info("Starting Book Recommendation System API")
    logger.info("="*60)
    
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
