"""
Google Gemini AI Integration Service
Provides AI-powered book summaries, Q&A, and recommendations
Using Gemini 2.0 Flash (free tier)
"""

import os
import logging
from typing import List, Dict, Optional
import json

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

from models.book import Book

logger = logging.getLogger(__name__)


class GeminiService:
    """Google Gemini AI service for book-related AI features"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "AIzaSyA-yHAtSgbeQjdmeWeqRLcNTaM25Bpl2WE")
        self.available = GEMINI_AVAILABLE and self.api_key is not None
        self.model = None
        
        if self.available:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-2.5-flash')
                logger.info("✅ Google Gemini AI service initialized (Gemini 2.5 Flash)")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
                self.available = False
        else:
            logger.warning("⚠️  Gemini service not available (missing API key or library)")
    
    def generate_summary(self, book: Book, length: str = "medium") -> str:
        """
        Generate AI summary of a book
        
        Args:
            book: Book object
            length: "short" (50 words), "medium" (150 words), "long" (300 words)
        """
        if not self.available:
            return self._mock_summary(book)
        
        word_limits = {"short": 50, "medium": 150, "long": 300}
        word_limit = word_limits.get(length, 150)
        
        try:
            prompt = f"""You are a knowledgeable book critic and summarizer.

Generate a {length} summary (approximately {word_limit} words) of the book:
Title: {book.title}
Authors: {', '.join(book.authors)}
Description: {book.description or 'No description available'}

Provide an engaging summary that captures the essence of the book."""
            
            response = self.model.generate_content(prompt)
            summary = response.text.strip()
            logger.info(f"Generated summary for: {book.title}")
            return summary
            
        except Exception as e:
            logger.error(f"Gemini summary generation failed: {e}")
            return self._mock_summary(book)
    
    def answer_question(self, book: Book, question: str) -> str:
        """
        Answer questions about a book using Gemini AI
        
        Args:
            book: Book object
            question: User's question
        """
        if not self.available:
            return self._mock_answer(question)
        
        try:
            prompt = f"""You are a helpful book assistant.

Book Information:
Title: {book.title}
Authors: {', '.join(book.authors)}
Description: {book.description or 'No description available'}
Subjects: {', '.join(book.subjects or [])}

User Question: {question}

Provide a helpful and accurate answer based on the book information."""
            
            response = self.model.generate_content(prompt)
            answer = response.text.strip()
            logger.info(f"Answered question about: {book.title}")
            return answer
            
        except Exception as e:
            logger.error(f"Gemini Q&A failed: {e}")
            return self._mock_answer(question)
    
    def generate_reading_list(self, mood: str, preferences: Dict, count: int = 10) -> List[str]:
        """
        Generate personalized reading list based on mood and preferences
        
        Args:
            mood: User's current mood
            preferences: User preferences (genres, authors, etc.)
            count: Number of book suggestions
        """
        if not self.available:
            return self._mock_reading_list(mood, count)
        
        try:
            prompt = f"""You are an expert book recommender.

Generate a reading list of {count} books for someone who:
- Current mood: {mood}
- Favorite genres: {', '.join(preferences.get('genres', []))}
- Favorite authors: {', '.join(preferences.get('authors', []))}

Provide book titles and authors in this format:
1. "Book Title" by Author Name
2. "Book Title" by Author Name
..."""
            
            response = self.model.generate_content(prompt)
            suggestions = response.text.strip().split('\n')
            logger.info(f"Generated reading list for mood: {mood}")
            return [s.strip() for s in suggestions if s.strip()]
            
        except Exception as e:
            logger.error(f"Gemini reading list generation failed: {e}")
            return self._mock_reading_list(mood, count)
    
    def compare_books(self, book1: Book, book2: Book) -> Dict:
        """
        Compare two books using AI analysis
        
        Args:
            book1: First book
            book2: Second book
        """
        if not self.available:
            return self._mock_comparison(book1, book2)
        
        try:
            prompt = f"""You are a literary analyst.

Compare these two books:

Book 1:
Title: {book1.title}
Authors: {', '.join(book1.authors)}
Description: {book1.description or 'N/A'}

Book 2:
Title: {book2.title}
Authors: {', '.join(book2.authors)}
Description: {book2.description or 'N/A'}

Provide a comparison covering:
1. Similarities
2. Differences
3. Which book for which reader"""
            
            response = self.model.generate_content(prompt)
            comparison = response.text.strip()
            logger.info(f"Compared: {book1.title} vs {book2.title}")
            
            return {
                "book1": book1.title,
                "book2": book2.title,
                "comparison": comparison
            }
            
        except Exception as e:
            logger.error(f"Gemini comparison failed: {e}")
            return self._mock_comparison(book1, book2)
    
    # Mock methods for when Gemini is not available
    def _mock_summary(self, book: Book) -> str:
        """Mock summary when Gemini is not available"""
        if book.description:
            return book.description[:200] + "..."
        return f"A book titled '{book.title}' by {', '.join(book.authors)}."
    
    def _mock_answer(self, question: str) -> str:
        """Mock answer when Gemini is not available"""
        return f"I would love to answer your question: '{question}', but Gemini AI integration is not configured. Please install google-generativeai library to enable this feature."
    
    def _mock_reading_list(self, mood: str, count: int) -> List[str]:
        """Mock reading list when Gemini is not available"""
        return [
            f"Book suggestion {i} for {mood} mood (Gemini AI not configured)"
            for i in range(1, count + 1)
        ]
    
    def _mock_comparison(self, book1: Book, book2: Book) -> Dict:
        """Mock comparison when Gemini is not available"""
        return {
            "book1": book1.title,
            "book2": book2.title,
            "comparison": "Gemini AI comparison not available. Please install google-generativeai library."
        }


# Global Gemini service instance
gemini_service = GeminiService()
