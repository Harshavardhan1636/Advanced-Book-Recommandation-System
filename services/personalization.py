"""
Personalization Service
Advanced user preference management and smart filtering
"""

import logging
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict
import numpy as np

from models.book import Book
from models.user import UserProfile

logger = logging.getLogger(__name__)


class PersonalizationService:
    """Advanced personalization and filtering service"""
    
    @staticmethod
    def calculate_user_preferences(profile: UserProfile) -> Dict:
        """
        Calculate detailed user preferences from reading history
        
        Returns:
            Dict with genre weights, author weights, difficulty preferences, etc.
        """
        preferences = {
            "genre_weights": {},
            "author_weights": {},
            "avg_book_length": 0,
            "preferred_difficulty": "medium",
            "reading_pace": "average",
            "mood_preferences": {}
        }
        
        if not profile.reading_history:
            return preferences
        
        # Calculate genre weights
        genre_counts = defaultdict(int)
        genre_ratings = defaultdict(list)
        
        for entry in profile.reading_history:
            for genre in entry.tags:
                genre_counts[genre] += 1
                if entry.rating:
                    genre_ratings[genre].append(entry.rating)
        
        # Weight genres by frequency and average rating
        for genre in genre_counts:
            frequency_weight = genre_counts[genre] / len(profile.reading_history)
            rating_weight = np.mean(genre_ratings[genre]) / 5.0 if genre_ratings[genre] else 0.5
            preferences["genre_weights"][genre] = (frequency_weight + rating_weight) / 2
        
        # Calculate author weights
        author_counts = defaultdict(int)
        for entry in profile.reading_history:
            for author in entry.authors:
                author_counts[author] += 1
        
        total_books = len(profile.reading_history)
        preferences["author_weights"] = {
            author: count / total_books
            for author, count in author_counts.items()
        }
        
        # Estimate reading pace
        finished_books = [
            entry for entry in profile.reading_history
            if entry.read_date and entry.status == "read"
        ]
        
        if len(finished_books) >= 2:
            # Calculate average books per month
            dates = sorted([datetime.fromisoformat(entry.read_date) for entry in finished_books])
            time_span = (dates[-1] - dates[0]).days / 30  # months
            books_per_month = len(finished_books) / max(time_span, 1)
            
            if books_per_month > 3:
                preferences["reading_pace"] = "fast"
            elif books_per_month < 1:
                preferences["reading_pace"] = "slow"
            else:
                preferences["reading_pace"] = "average"
        
        logger.info(f"Calculated preferences for user with {len(profile.reading_history)} books")
        return preferences
    
    @staticmethod
    def smart_filter(
        books: List[Book],
        filters: Dict,
        user_preferences: Optional[Dict] = None
    ) -> List[Book]:
        """
        Multi-dimensional filtering with smart defaults
        
        Args:
            books: List of books to filter
            filters: Filter criteria (genre, length, difficulty, mood, etc.)
            user_preferences: Optional user preferences for smart filtering
        """
        filtered = books.copy()
        
        # Genre filter
        if "genres" in filters and filters["genres"]:
            filtered = [
                book for book in filtered
                if any(genre in (book.subjects or []) for genre in filters["genres"])
            ]
        
        # Year range filter
        if "year_min" in filters:
            filtered = [book for book in filtered if book.year and book.year >= filters["year_min"]]
        if "year_max" in filters:
            filtered = [book for book in filtered if book.year and book.year <= filters["year_max"]]
        
        # Rating filter
        if "rating_min" in filters:
            filtered = [book for book in filtered if book.rating and book.rating >= filters["rating_min"]]
        
        # Length filter (page count)
        if "length" in filters:
            length_ranges = {
                "short": (0, 200),
                "medium": (200, 400),
                "long": (400, 1000)
            }
            if filters["length"] in length_ranges:
                min_pages, max_pages = length_ranges[filters["length"]]
                filtered = [
                    book for book in filtered
                    if book.page_count and min_pages <= book.page_count <= max_pages
                ]
        
        # Difficulty filter (based on subjects and description complexity)
        if "difficulty" in filters:
            # This is a simplified difficulty estimation
            # In production, you might use readability scores
            difficulty = filters["difficulty"]
            if difficulty == "easy":
                filtered = [
                    book for book in filtered
                    if not any(subj in (book.subjects or []) for subj in ["Philosophy", "Science", "Mathematics"])
                ]
            elif difficulty == "hard":
                filtered = [
                    book for book in filtered
                    if any(subj in (book.subjects or []) for subj in ["Philosophy", "Science", "Mathematics", "History"])
                ]
        
        # Mood filter
        if "mood" in filters:
            mood_keywords = {
                "happy": ["comedy", "humor", "light", "fun"],
                "sad": ["tragedy", "drama", "emotional"],
                "relaxing": ["cozy", "gentle", "peaceful"],
                "exciting": ["thriller", "adventure", "action"],
                "thoughtful": ["philosophy", "literary", "thought-provoking"]
            }
            
            if filters["mood"] in mood_keywords:
                keywords = mood_keywords[filters["mood"]]
                filtered = [
                    book for book in filtered
                    if any(
                        keyword in (book.description or "").lower()
                        or keyword in " ".join(book.subjects or []).lower()
                        for keyword in keywords
                    )
                ]
        
        logger.info(f"Filtered {len(books)} books to {len(filtered)} books")
        return filtered
    
    @staticmethod
    def custom_sort(
        books: List[Book],
        sort_by: str = "relevance",
        user_preferences: Optional[Dict] = None
    ) -> List[Book]:
        """
        Custom sorting with weighted scoring
        
        Args:
            books: List of books to sort
            sort_by: Sort criterion (relevance, rating, popularity, year, custom)
            user_preferences: User preferences for weighted scoring
        """
        if sort_by == "rating":
            return sorted(books, key=lambda b: b.rating or 0, reverse=True)
        
        elif sort_by == "year":
            return sorted(books, key=lambda b: b.year or 0, reverse=True)
        
        elif sort_by == "popularity":
            return sorted(books, key=lambda b: b.popularity_score or 0, reverse=True)
        
        elif sort_by == "custom" and user_preferences:
            # Weighted scoring based on user preferences
            def calculate_score(book: Book) -> float:
                score = 0.0
                
                # Genre match score
                genre_weights = user_preferences.get("genre_weights", {})
                for subject in (book.subjects or []):
                    score += genre_weights.get(subject, 0) * 0.4
                
                # Author match score
                author_weights = user_preferences.get("author_weights", {})
                for author in book.authors:
                    score += author_weights.get(author, 0) * 0.3
                
                # Rating score
                if book.rating:
                    score += (book.rating / 5.0) * 0.2
                
                # Popularity score
                if book.popularity_score:
                    score += book.popularity_score * 0.1
                
                return score
            
            return sorted(books, key=calculate_score, reverse=True)
        
        else:  # relevance (default)
            return sorted(
                books,
                key=lambda b: (b.popularity_score or 0) * 0.5 + (b.rating or 0) * 0.5,
                reverse=True
            )
    
    @staticmethod
    def get_reading_goals(profile: UserProfile) -> Dict:
        """
        Get and track reading goals
        
        Returns:
            Dict with current goals, progress, and recommendations
        """
        current_year = datetime.now().year
        
        # Count books read this year
        books_this_year = [
            entry for entry in profile.reading_history
            if entry.read_date and datetime.fromisoformat(entry.read_date).year == current_year
        ]
        
        # Default goal: 52 books per year (1 per week)
        annual_goal = 52
        current_progress = len(books_this_year)
        
        # Calculate if on track
        days_in_year = 365
        days_passed = datetime.now().timetuple().tm_yday
        expected_progress = int((days_passed / days_in_year) * annual_goal)
        
        on_track = current_progress >= expected_progress
        books_behind = max(0, expected_progress - current_progress)
        
        # Calculate projected total
        if days_passed > 0:
            daily_rate = current_progress / days_passed
            projected_total = int(daily_rate * days_in_year)
        else:
            projected_total = 0
        
        return {
            "annual_goal": annual_goal,
            "current_progress": current_progress,
            "expected_progress": expected_progress,
            "on_track": on_track,
            "books_behind": books_behind,
            "projected_total": projected_total,
            "percentage": round((current_progress / annual_goal) * 100, 1),
            "books_remaining": max(0, annual_goal - current_progress)
        }
    
    @staticmethod
    def recommend_when_to_read(book: Book, user_preferences: Dict) -> Dict:
        """
        Recommend when to read a book based on user patterns
        
        Returns:
            Dict with recommended time, reason, and priority
        """
        recommendations = {
            "priority": "medium",
            "best_time": "weekend",
            "reason": "Based on your reading patterns",
            "estimated_days": 7
        }
        
        # Estimate reading time based on pace
        reading_pace = user_preferences.get("reading_pace", "average")
        page_count = book.page_count or 300
        
        if reading_pace == "fast":
            days_to_read = max(1, page_count // 100)
        elif reading_pace == "slow":
            days_to_read = max(3, page_count // 30)
        else:  # average
            days_to_read = max(2, page_count // 50)
        
        recommendations["estimated_days"] = days_to_read
        
        # Determine priority based on genre preferences
        genre_weights = user_preferences.get("genre_weights", {})
        max_weight = 0
        for subject in (book.subjects or []):
            weight = genre_weights.get(subject, 0)
            max_weight = max(max_weight, weight)
        
        if max_weight > 0.7:
            recommendations["priority"] = "high"
            recommendations["reason"] = "This matches your favorite genres!"
        elif max_weight > 0.4:
            recommendations["priority"] = "medium"
        else:
            recommendations["priority"] = "low"
        
        # Recommend time based on book length
        if days_to_read <= 2:
            recommendations["best_time"] = "weekend"
        elif days_to_read <= 7:
            recommendations["best_time"] = "this week"
        else:
            recommendations["best_time"] = "when you have more time"
        
        return recommendations
    
    @staticmethod
    def find_similar_users(
        user_profile: UserProfile,
        all_profiles: List[UserProfile],
        limit: int = 10
    ) -> List[Tuple[UserProfile, float]]:
        """
        Find users with similar reading tastes
        
        Returns:
            List of (UserProfile, similarity_score) tuples
        """
        if not user_profile.reading_history:
            return []
        
        # Get user's favorite genres and authors
        user_genres = set()
        user_authors = set()
        
        for entry in user_profile.reading_history:
            user_genres.update(entry.tags)
            user_authors.update(entry.authors)
        
        similar_users = []
        
        for other_profile in all_profiles:
            if other_profile.user_id == user_profile.user_id:
                continue
            
            if not other_profile.reading_history:
                continue
            
            # Get other user's genres and authors
            other_genres = set()
            other_authors = set()
            
            for entry in other_profile.reading_history:
                other_genres.update(entry.tags)
                other_authors.update(entry.authors)
            
            # Calculate Jaccard similarity
            genre_similarity = len(user_genres & other_genres) / len(user_genres | other_genres) if user_genres or other_genres else 0
            author_similarity = len(user_authors & other_authors) / len(user_authors | other_authors) if user_authors or other_authors else 0
            
            # Combined similarity
            similarity = (genre_similarity * 0.6 + author_similarity * 0.4)
            
            if similarity > 0.1:  # Minimum threshold
                similar_users.append((other_profile, similarity))
        
        # Sort by similarity and return top matches
        similar_users.sort(key=lambda x: x[1], reverse=True)
        return similar_users[:limit]


# Global personalization service
personalization_service = PersonalizationService()
