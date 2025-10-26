"""
Main Recommendation Engine coordinating all recommendation strategies
Includes sentiment analysis and context-aware recommendations
"""

import logging
from typing import List, Optional, Dict
from datetime import datetime
import re
from collections import Counter

from models.book import Book, BookRecommendation
from models.user import UserProfile
from .ml_recommender import MLRecommender, TFIDFRecommender, CollaborativeFilteringRecommender

logger = logging.getLogger(__name__)


class SentimentAnalyzer:
    """Simple sentiment analysis for book descriptions"""
    
    # Positive and negative word lists
    POSITIVE_WORDS = {
        'excellent', 'amazing', 'wonderful', 'brilliant', 'outstanding', 'fantastic',
        'great', 'good', 'best', 'love', 'beautiful', 'perfect', 'incredible',
        'masterpiece', 'compelling', 'engaging', 'captivating', 'thrilling',
        'inspiring', 'powerful', 'moving', 'delightful', 'entertaining'
    }
    
    NEGATIVE_WORDS = {
        'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'disappointing',
        'boring', 'dull', 'weak', 'confusing', 'tedious', 'mediocre', 'bland',
        'predictable', 'slow', 'disappointing', 'frustrating'
    }
    
    def analyze(self, text: str) -> float:
        """
        Analyze sentiment of text
        Returns score between -1 (negative) and 1 (positive)
        """
        if not text:
            return 0.0
        
        # Tokenize and clean
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Count positive and negative words
        positive_count = sum(1 for word in words if word in self.POSITIVE_WORDS)
        negative_count = sum(1 for word in words if word in self.NEGATIVE_WORDS)
        
        # Calculate sentiment score
        total = positive_count + negative_count
        if total == 0:
            return 0.0
        
        sentiment = (positive_count - negative_count) / total
        return sentiment
    
    def get_sentiment_label(self, score: float) -> str:
        """Get sentiment label from score"""
        if score > 0.3:
            return "Positive"
        elif score < -0.3:
            return "Negative"
        else:
            return "Neutral"


class RecommendationEngine:
    """
    Main recommendation engine coordinating all strategies
    Provides context-aware, personalized recommendations
    """
    
    def __init__(self, strategy: str = "hybrid"):
        """
        Initialize recommendation engine
        
        Args:
            strategy: 'hybrid', 'tfidf', or 'collaborative'
        """
        self.sentiment_analyzer = SentimentAnalyzer()
        
        # Initialize strategy
        if strategy == "hybrid":
            self.recommender = MLRecommender()
        elif strategy == "tfidf":
            self.recommender = TFIDFRecommender()
        elif strategy == "collaborative":
            self.recommender = CollaborativeFilteringRecommender()
        else:
            self.recommender = MLRecommender()
        
        logger.info(f"Initialized RecommendationEngine with {strategy} strategy")
    
    def get_recommendations(
        self,
        target_book: Book,
        candidates: List[Book],
        user_profile: Optional[UserProfile] = None,
        context: Optional[Dict] = None,
        top_n: int = 10
    ) -> List[BookRecommendation]:
        """
        Get personalized recommendations
        
        Args:
            target_book: Book to base recommendations on
            candidates: List of candidate books
            user_profile: User profile for personalization
            context: Additional context (time, mood, etc.)
            top_n: Number of recommendations to return
        """
        try:
            # Enrich books with sentiment analysis
            self._enrich_with_sentiment(candidates)
            
            # Get base recommendations
            recommendations = self.recommender.recommend(
                target_book, candidates, user_profile, top_n=top_n*2
            )
            
            # Apply context-aware filtering
            if context:
                recommendations = self._apply_context_filters(recommendations, context)
            
            # Apply diversity
            recommendations = self._ensure_diversity(recommendations, top_n)
            
            logger.info(f"Generated {len(recommendations)} final recommendations")
            return recommendations[:top_n]
            
        except Exception as e:
            logger.error(f"Recommendation generation failed: {e}")
            return []
    
    def get_trending_recommendations(
        self,
        candidates: List[Book],
        time_window: str = "recent",
        top_n: int = 10
    ) -> List[BookRecommendation]:
        """
        Get trending book recommendations
        
        Args:
            candidates: List of candidate books
            time_window: 'recent', 'this_year', 'classic'
            top_n: Number of recommendations
        """
        current_year = datetime.now().year
        
        # Filter by time window
        if time_window == "recent":
            filtered = [b for b in candidates if b.year and b.year >= current_year - 2]
        elif time_window == "this_year":
            filtered = [b for b in candidates if b.year == current_year]
        elif time_window == "classic":
            filtered = [b for b in candidates if b.year and b.year < 2000]
        else:
            filtered = candidates
        
        # Sort by popularity
        filtered.sort(key=lambda b: b.popularity_score or 0, reverse=True)
        
        # Create recommendations
        recommendations = []
        for book in filtered[:top_n]:
            recommendations.append(BookRecommendation(
                book=book,
                score=book.popularity_score or 0.5,
                algorithm="Trending",
                reasons=[
                    f"Published in {book.year}",
                    f"{book.edition_count} editions",
                    f"Rating: {book.rating:.1f}/5.0" if book.rating else "Popular choice"
                ]
            ))
        
        return recommendations
    
    def get_mood_based_recommendations(
        self,
        candidates: List[Book],
        mood: str,
        top_n: int = 10
    ) -> List[BookRecommendation]:
        """
        Get mood-based recommendations
        
        Args:
            candidates: List of candidate books
            mood: 'happy', 'sad', 'adventurous', 'thoughtful', 'relaxed'
            top_n: Number of recommendations
        """
        # Mood to genre mapping
        mood_genres = {
            'happy': ['comedy', 'romance', 'humor', 'feel-good'],
            'sad': ['drama', 'literary fiction', 'poetry'],
            'adventurous': ['adventure', 'action', 'thriller', 'fantasy'],
            'thoughtful': ['philosophy', 'non-fiction', 'science', 'history'],
            'relaxed': ['mystery', 'cozy', 'light fiction', 'travel']
        }
        
        target_genres = mood_genres.get(mood.lower(), [])
        
        # Score books based on mood match
        scored_books = []
        for book in candidates:
            score = 0.0
            if book.subjects:
                # Check genre overlap
                book_genres = [s.lower() for s in book.subjects]
                matches = sum(1 for genre in target_genres if any(genre in bg for bg in book_genres))
                score = matches / len(target_genres) if target_genres else 0.0
            
            # Boost with sentiment if available
            if book.sentiment_score:
                if mood == 'happy' and book.sentiment_score > 0:
                    score *= 1.2
                elif mood == 'sad' and book.sentiment_score < 0:
                    score *= 1.2
            
            if score > 0:
                scored_books.append((book, score))
        
        # Sort and create recommendations
        scored_books.sort(key=lambda x: x[1], reverse=True)
        
        recommendations = []
        for book, score in scored_books[:top_n]:
            recommendations.append(BookRecommendation(
                book=book,
                score=score,
                algorithm="Mood-Based",
                reasons=[
                    f"Matches '{mood}' mood",
                    f"Genres: {', '.join(book.subjects[:3]) if book.subjects else 'Various'}",
                    f"Sentiment: {self.sentiment_analyzer.get_sentiment_label(book.sentiment_score or 0)}"
                ]
            ))
        
        return recommendations
    
    def _enrich_with_sentiment(self, books: List[Book]):
        """Add sentiment analysis to books"""
        for book in books:
            if book.description and not book.sentiment_score:
                book.sentiment_score = self.sentiment_analyzer.analyze(book.description)
    
    def _apply_context_filters(
        self,
        recommendations: List[BookRecommendation],
        context: Dict
    ) -> List[BookRecommendation]:
        """Apply context-aware filtering"""
        filtered = recommendations.copy()
        
        # Time-based filtering
        if 'time_of_day' in context:
            time = context['time_of_day']
            if time == 'night':
                # Prefer lighter reads at night
                for rec in filtered:
                    if rec.book.page_count and rec.book.page_count < 300:
                        rec.score *= 1.1
        
        # Reading goal filtering
        if 'reading_goal' in context:
            goal = context['reading_goal']
            if goal == 'quick_read':
                filtered = [r for r in filtered if not r.book.page_count or r.book.page_count < 400]
            elif goal == 'deep_dive':
                filtered = [r for r in filtered if r.book.page_count and r.book.page_count > 300]
        
        # Re-sort after adjustments
        filtered.sort(reverse=True)
        return filtered
    
    def _ensure_diversity(
        self,
        recommendations: List[BookRecommendation],
        top_n: int
    ) -> List[BookRecommendation]:
        """Ensure diversity in recommendations"""
        if len(recommendations) <= top_n:
            return recommendations
        
        diverse_recs = []
        seen_authors = set()
        seen_subjects = set()
        
        # First pass: add highly scored diverse books
        for rec in recommendations:
            if len(diverse_recs) >= top_n:
                break
            
            # Check author diversity
            authors_new = not any(author in seen_authors for author in rec.book.authors)
            
            # Check subject diversity
            subjects_new = True
            if rec.book.subjects:
                subjects_new = not any(subj in seen_subjects for subj in rec.book.subjects[:3])
            
            if authors_new or subjects_new or len(diverse_recs) < top_n // 2:
                diverse_recs.append(rec)
                seen_authors.update(rec.book.authors)
                if rec.book.subjects:
                    seen_subjects.update(rec.book.subjects[:3])
        
        # Fill remaining slots with highest scored
        if len(diverse_recs) < top_n:
            for rec in recommendations:
                if rec not in diverse_recs:
                    diverse_recs.append(rec)
                    if len(diverse_recs) >= top_n:
                        break
        
        return diverse_recs
