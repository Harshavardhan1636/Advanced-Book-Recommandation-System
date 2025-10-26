"""
Advanced Analytics & Business Intelligence Service
Reading patterns, predictive analytics, sentiment tracking, A/B testing, user behavior
"""

import logging
from typing import List, Dict, Optional, Any, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import statistics

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

logger = logging.getLogger(__name__)


# ============================================================================
# READING PATTERNS ANALYSIS
# ============================================================================

class ReadingPatternsAnalyzer:
    """Analyze reading patterns and habits"""
    
    def __init__(self):
        logger.info("✅ Reading Patterns Analyzer initialized")
    
    def analyze_time_patterns(
        self,
        reading_sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze time-of-day and duration patterns
        
        Args:
            reading_sessions: List of reading sessions with timestamps
        
        Returns:
            Time pattern analysis
        """
        if not reading_sessions:
            return {}
        
        # Group by hour of day
        hour_counts = defaultdict(int)
        hour_durations = defaultdict(list)
        
        for session in reading_sessions:
            timestamp = datetime.fromisoformat(session.get("timestamp", datetime.now().isoformat()))
            hour = timestamp.hour
            duration = session.get("duration_minutes", 0)
            
            hour_counts[hour] += 1
            hour_durations[hour].append(duration)
        
        # Find peak reading times
        peak_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        
        # Calculate average duration by time of day
        avg_durations = {
            hour: statistics.mean(durations)
            for hour, durations in hour_durations.items()
        }
        
        # Categorize reading times
        time_categories = {
            "morning": sum(hour_counts[h] for h in range(6, 12)),
            "afternoon": sum(hour_counts[h] for h in range(12, 18)),
            "evening": sum(hour_counts[h] for h in range(18, 23)),
            "night": sum(hour_counts[h] for h in list(range(23, 24)) + list(range(0, 6)))
        }
        
        preferred_time = max(time_categories.items(), key=lambda x: x[1])[0]
        
        return {
            "peak_hours": [{"hour": h, "sessions": c} for h, c in peak_hours],
            "preferred_time_of_day": preferred_time,
            "time_distribution": time_categories,
            "average_session_duration": statistics.mean([s.get("duration_minutes", 0) for s in reading_sessions]),
            "total_reading_time": sum([s.get("duration_minutes", 0) for s in reading_sessions])
        }
    
    def analyze_reading_speed(
        self,
        reading_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze reading speed patterns"""
        speeds = []
        
        for entry in reading_history:
            pages = entry.get("pages", 0)
            duration = entry.get("duration_minutes", 0)
            
            if pages > 0 and duration > 0:
                pages_per_hour = (pages / duration) * 60
                speeds.append(pages_per_hour)
        
        if not speeds:
            return {"average_pages_per_hour": 0}
        
        return {
            "average_pages_per_hour": round(statistics.mean(speeds), 1),
            "fastest_speed": round(max(speeds), 1),
            "slowest_speed": round(min(speeds), 1),
            "speed_category": self._categorize_speed(statistics.mean(speeds))
        }
    
    def _categorize_speed(self, pages_per_hour: float) -> str:
        """Categorize reading speed"""
        if pages_per_hour < 30:
            return "slow"
        elif pages_per_hour < 50:
            return "average"
        elif pages_per_hour < 80:
            return "fast"
        else:
            return "very_fast"


# ============================================================================
# GENRE EVOLUTION TRACKER
# ============================================================================

class GenreEvolutionTracker:
    """Track how reading tastes change over time"""
    
    def __init__(self):
        logger.info("✅ Genre Evolution Tracker initialized")
    
    def track_genre_evolution(
        self,
        reading_history: List[Dict[str, Any]],
        time_window_months: int = 6
    ) -> Dict[str, Any]:
        """
        Track genre preferences over time
        
        Args:
            reading_history: Reading history with genres and dates
            time_window_months: Time window for analysis
        
        Returns:
            Genre evolution analysis
        """
        if not reading_history:
            return {}
        
        # Sort by date
        sorted_history = sorted(
            reading_history,
            key=lambda x: datetime.fromisoformat(x.get("read_date", datetime.now().isoformat()))
        )
        
        # Split into time periods
        now = datetime.now()
        periods = []
        
        for i in range(time_window_months):
            period_start = now - timedelta(days=30 * (i + 1))
            period_end = now - timedelta(days=30 * i)
            
            period_books = [
                book for book in sorted_history
                if period_start <= datetime.fromisoformat(book.get("read_date", datetime.now().isoformat())) < period_end
            ]
            
            if period_books:
                genre_counts = Counter()
                for book in period_books:
                    for genre in book.get("genres", []):
                        genre_counts[genre] += 1
                
                periods.append({
                    "period": f"{period_start.strftime('%b %Y')}",
                    "top_genres": dict(genre_counts.most_common(5)),
                    "books_read": len(period_books)
                })
        
        # Identify trends
        trends = self._identify_trends(periods)
        
        return {
            "periods": periods,
            "trends": trends,
            "current_favorites": periods[0]["top_genres"] if periods else {},
            "emerging_interests": trends.get("emerging", []),
            "declining_interests": trends.get("declining", [])
        }
    
    def _identify_trends(self, periods: List[Dict]) -> Dict[str, List[str]]:
        """Identify emerging and declining genre interests"""
        if len(periods) < 2:
            return {"emerging": [], "declining": []}
        
        recent = periods[0]["top_genres"]
        older = periods[-1]["top_genres"]
        
        emerging = [genre for genre in recent if genre not in older]
        declining = [genre for genre in older if genre not in recent]
        
        return {
            "emerging": emerging[:3],
            "declining": declining[:3]
        }


# ============================================================================
# PREDICTIVE ANALYTICS
# ============================================================================

class PredictiveAnalytics:
    """Predict next book before finishing current one"""
    
    def __init__(self):
        logger.info("✅ Predictive Analytics initialized")
    
    def predict_next_book(
        self,
        current_book: Dict[str, Any],
        reading_history: List[Dict[str, Any]],
        available_books: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Predict next book recommendations
        
        Args:
            current_book: Currently reading book
            reading_history: User's reading history
            available_books: Available books to recommend
        
        Returns:
            Predicted next books with confidence scores
        """
        # Analyze patterns from history
        patterns = self._analyze_reading_patterns(reading_history)
        
        # Score available books
        scored_books = []
        for book in available_books[:50]:  # Limit for performance
            score = self._calculate_prediction_score(
                book,
                current_book,
                patterns
            )
            
            scored_books.append({
                "book": book,
                "prediction_score": score,
                "confidence": self._calculate_confidence(score),
                "reasons": self._generate_reasons(book, current_book, patterns)
            })
        
        # Sort by score
        scored_books.sort(key=lambda x: x["prediction_score"], reverse=True)
        
        return scored_books[:10]
    
    def _analyze_reading_patterns(
        self,
        reading_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze patterns from reading history"""
        if not reading_history:
            return {}
        
        # Genre preferences
        genre_counts = Counter()
        for book in reading_history:
            for genre in book.get("genres", []):
                genre_counts[genre] += 1
        
        # Author preferences
        author_counts = Counter()
        for book in reading_history:
            for author in book.get("authors", []):
                author_counts[author] += 1
        
        # Length preferences
        lengths = [book.get("page_count", 0) for book in reading_history if book.get("page_count")]
        avg_length = statistics.mean(lengths) if lengths else 300
        
        return {
            "preferred_genres": dict(genre_counts.most_common(5)),
            "preferred_authors": dict(author_counts.most_common(5)),
            "preferred_length": avg_length,
            "reading_pace": len(reading_history) / max(1, len(set(b.get("read_date", "")[:7] for b in reading_history)))
        }
    
    def _calculate_prediction_score(
        self,
        book: Dict[str, Any],
        current_book: Dict[str, Any],
        patterns: Dict[str, Any]
    ) -> float:
        """Calculate prediction score for a book"""
        score = 0.0
        
        # Genre match
        book_genres = set(book.get("genres", []))
        preferred_genres = set(patterns.get("preferred_genres", {}).keys())
        genre_overlap = len(book_genres & preferred_genres)
        score += genre_overlap * 0.3
        
        # Author match
        book_authors = set(book.get("authors", []))
        preferred_authors = set(patterns.get("preferred_authors", {}).keys())
        author_overlap = len(book_authors & preferred_authors)
        score += author_overlap * 0.2
        
        # Length similarity
        book_length = book.get("page_count", 300)
        preferred_length = patterns.get("preferred_length", 300)
        length_diff = abs(book_length - preferred_length) / preferred_length
        score += max(0, 1 - length_diff) * 0.2
        
        # Rating
        score += (book.get("rating", 0) / 5.0) * 0.3
        
        return score
    
    def _calculate_confidence(self, score: float) -> str:
        """Calculate confidence level"""
        if score > 0.7:
            return "high"
        elif score > 0.4:
            return "medium"
        else:
            return "low"
    
    def _generate_reasons(
        self,
        book: Dict[str, Any],
        current_book: Dict[str, Any],
        patterns: Dict[str, Any]
    ) -> List[str]:
        """Generate reasons for recommendation"""
        reasons = []
        
        # Genre match
        book_genres = set(book.get("genres", []))
        preferred_genres = set(patterns.get("preferred_genres", {}).keys())
        if book_genres & preferred_genres:
            reasons.append(f"Matches your favorite genres")
        
        # Similar to current
        current_genres = set(current_book.get("genres", []))
        if book_genres & current_genres:
            reasons.append(f"Similar to what you're reading now")
        
        # High rating
        if book.get("rating", 0) >= 4.0:
            reasons.append(f"Highly rated ({book.get('rating')}/5)")
        
        return reasons


# ============================================================================
# SENTIMENT TRACKING
# ============================================================================

class SentimentTracker:
    """Track mood correlation with genres"""
    
    def __init__(self):
        logger.info("✅ Sentiment Tracker initialized")
    
    def track_mood_genre_correlation(
        self,
        reading_sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Track correlation between mood and genre choices
        
        Args:
            reading_sessions: Sessions with mood and genre data
        
        Returns:
            Mood-genre correlation analysis
        """
        mood_genre_map = defaultdict(lambda: defaultdict(int))
        
        for session in reading_sessions:
            mood = session.get("mood", "neutral")
            genres = session.get("genres", [])
            
            for genre in genres:
                mood_genre_map[mood][genre] += 1
        
        # Find strongest correlations
        correlations = {}
        for mood, genres in mood_genre_map.items():
            top_genre = max(genres.items(), key=lambda x: x[1]) if genres else ("unknown", 0)
            correlations[mood] = {
                "preferred_genre": top_genre[0],
                "frequency": top_genre[1],
                "all_genres": dict(genres)
            }
        
        return {
            "mood_genre_correlations": correlations,
            "insights": self._generate_mood_insights(correlations)
        }
    
    def _generate_mood_insights(
        self,
        correlations: Dict[str, Dict]
    ) -> List[str]:
        """Generate insights from mood correlations"""
        insights = []
        
        for mood, data in correlations.items():
            genre = data["preferred_genre"]
            insights.append(f"When {mood}, you prefer {genre}")
        
        return insights


# ============================================================================
# NETWORK ANALYSIS
# ============================================================================

class NetworkAnalyzer:
    """Author/genre relationship graphs"""
    
    def __init__(self):
        logger.info("✅ Network Analyzer initialized")
    
    def build_author_network(
        self,
        reading_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Build author relationship network
        
        Args:
            reading_history: Reading history
        
        Returns:
            Author network graph data
        """
        # Build co-occurrence matrix
        author_connections = defaultdict(lambda: defaultdict(int))
        
        for book in reading_history:
            authors = book.get("authors", [])
            genres = book.get("genres", [])
            
            # Connect authors through shared genres
            for author in authors:
                for genre in genres:
                    author_connections[author][genre] += 1
        
        # Build network nodes and edges
        nodes = []
        edges = []
        
        # Author nodes
        for author, genres in author_connections.items():
            nodes.append({
                "id": author,
                "type": "author",
                "size": sum(genres.values())
            })
        
        # Genre nodes
        all_genres = set()
        for genres in author_connections.values():
            all_genres.update(genres.keys())
        
        for genre in all_genres:
            nodes.append({
                "id": genre,
                "type": "genre",
                "size": sum(1 for g in author_connections.values() if genre in g)
            })
        
        # Edges
        for author, genres in author_connections.items():
            for genre, weight in genres.items():
                edges.append({
                    "source": author,
                    "target": genre,
                    "weight": weight
                })
        
        return {
            "nodes": nodes,
            "edges": edges,
            "statistics": {
                "total_authors": len(author_connections),
                "total_genres": len(all_genres),
                "total_connections": len(edges)
            }
        }


# ============================================================================
# REPORT GENERATOR
# ============================================================================

class ReportGenerator:
    """Generate PDF/Excel reading reports"""
    
    def __init__(self):
        logger.info("✅ Report Generator initialized")
    
    def generate_reading_report(
        self,
        user_data: Dict[str, Any],
        format: str = "json"
    ) -> Dict[str, Any]:
        """
        Generate comprehensive reading report
        
        Args:
            user_data: User reading data
            format: Report format (json, pdf, excel)
        
        Returns:
            Report data
        """
        report = {
            "generated_at": datetime.now().isoformat(),
            "user_id": user_data.get("user_id"),
            "period": "All Time",
            
            "summary": {
                "total_books": len(user_data.get("reading_history", [])),
                "total_pages": sum(b.get("page_count", 0) for b in user_data.get("reading_history", [])),
                "average_rating": self._calculate_avg_rating(user_data.get("reading_history", [])),
                "favorite_genre": self._get_favorite_genre(user_data.get("reading_history", []))
            },
            
            "reading_patterns": {
                "books_per_month": self._calculate_books_per_month(user_data.get("reading_history", [])),
                "preferred_reading_time": user_data.get("preferred_time", "evening"),
                "average_book_length": self._calculate_avg_length(user_data.get("reading_history", []))
            },
            
            "achievements": user_data.get("achievements", []),
            "current_streak": user_data.get("streak", 0),
            "total_points": user_data.get("points", 0)
        }
        
        if format == "pdf":
            report["download_url"] = f"/api/reports/download/{user_data.get('user_id')}.pdf"
        elif format == "excel":
            report["download_url"] = f"/api/reports/download/{user_data.get('user_id')}.xlsx"
        
        return report
    
    def _calculate_avg_rating(self, books: List[Dict]) -> float:
        """Calculate average rating"""
        ratings = [b.get("rating", 0) for b in books if b.get("rating")]
        return round(statistics.mean(ratings), 2) if ratings else 0.0
    
    def _get_favorite_genre(self, books: List[Dict]) -> str:
        """Get most read genre"""
        genre_counts = Counter()
        for book in books:
            for genre in book.get("genres", []):
                genre_counts[genre] += 1
        
        return genre_counts.most_common(1)[0][0] if genre_counts else "Unknown"
    
    def _calculate_books_per_month(self, books: List[Dict]) -> float:
        """Calculate books per month"""
        if not books:
            return 0.0
        
        dates = [datetime.fromisoformat(b.get("read_date", datetime.now().isoformat())) for b in books if b.get("read_date")]
        if len(dates) < 2:
            return len(books)
        
        months = (max(dates) - min(dates)).days / 30
        return round(len(books) / max(months, 1), 1)
    
    def _calculate_avg_length(self, books: List[Dict]) -> int:
        """Calculate average book length"""
        lengths = [b.get("page_count", 0) for b in books if b.get("page_count")]
        return int(statistics.mean(lengths)) if lengths else 0


# ============================================================================
# A/B TESTING FRAMEWORK
# ============================================================================

class ABTestingFramework:
    """Feature experimentation and A/B testing"""
    
    def __init__(self):
        self.experiments: Dict[str, Dict] = {}
        logger.info("✅ A/B Testing Framework initialized")
    
    def create_experiment(
        self,
        name: str,
        variants: List[str],
        traffic_split: List[float]
    ) -> str:
        """
        Create A/B test experiment
        
        Args:
            name: Experiment name
            variants: List of variant names
            traffic_split: Traffic allocation (must sum to 1.0)
        
        Returns:
            Experiment ID
        """
        import uuid
        
        experiment_id = str(uuid.uuid4())[:8]
        
        self.experiments[experiment_id] = {
            "name": name,
            "variants": variants,
            "traffic_split": traffic_split,
            "created_at": datetime.now().isoformat(),
            "results": {variant: {"users": 0, "conversions": 0} for variant in variants}
        }
        
        logger.info(f"Created experiment: {name}")
        return experiment_id
    
    def assign_variant(self, experiment_id: str, user_id: int) -> str:
        """Assign user to a variant"""
        if experiment_id not in self.experiments:
            return "control"
        
        experiment = self.experiments[experiment_id]
        variants = experiment["variants"]
        traffic_split = experiment["traffic_split"]
        
        # Deterministic assignment based on user_id
        import hashlib
        hash_value = int(hashlib.md5(f"{user_id}{experiment_id}".encode()).hexdigest(), 16)
        position = (hash_value % 100) / 100.0
        
        cumulative = 0.0
        for variant, split in zip(variants, traffic_split):
            cumulative += split
            if position < cumulative:
                experiment["results"][variant]["users"] += 1
                return variant
        
        return variants[-1]
    
    def record_conversion(self, experiment_id: str, variant: str):
        """Record a conversion for a variant"""
        if experiment_id in self.experiments:
            self.experiments[experiment_id]["results"][variant]["conversions"] += 1
    
    def get_results(self, experiment_id: str) -> Dict[str, Any]:
        """Get experiment results"""
        if experiment_id not in self.experiments:
            return {}
        
        experiment = self.experiments[experiment_id]
        results = experiment["results"]
        
        # Calculate conversion rates
        for variant, data in results.items():
            users = data["users"]
            conversions = data["conversions"]
            data["conversion_rate"] = (conversions / users * 100) if users > 0 else 0
        
        return {
            "experiment_name": experiment["name"],
            "variants": results,
            "winner": max(results.items(), key=lambda x: x[1]["conversion_rate"])[0] if results else None
        }


# ============================================================================
# USER BEHAVIOR TRACKING
# ============================================================================

class BehaviorTracker:
    """Track user behavior, heatmaps, session recordings"""
    
    def __init__(self):
        self.sessions: Dict[str, List[Dict]] = defaultdict(list)
        logger.info("✅ Behavior Tracker initialized")
    
    def track_event(
        self,
        session_id: str,
        event_type: str,
        event_data: Dict[str, Any]
    ):
        """Track user event"""
        self.sessions[session_id].append({
            "timestamp": datetime.now().isoformat(),
            "type": event_type,
            "data": event_data
        })
    
    def get_heatmap_data(self, page: str) -> Dict[str, Any]:
        """Get heatmap data for a page"""
        # Mock heatmap data
        return {
            "page": page,
            "clicks": [
                {"x": 100, "y": 200, "count": 45},
                {"x": 300, "y": 150, "count": 32},
                {"x": 500, "y": 400, "count": 28}
            ],
            "scroll_depth": {
                "25%": 89,
                "50%": 67,
                "75%": 45,
                "100%": 23
            }
        }


# Global instances
reading_patterns_analyzer = ReadingPatternsAnalyzer()
genre_evolution_tracker = GenreEvolutionTracker()
predictive_analytics = PredictiveAnalytics()
sentiment_tracker = SentimentTracker()
network_analyzer = NetworkAnalyzer()
report_generator = ReportGenerator()
ab_testing_framework = ABTestingFramework()
behavior_tracker = BehaviorTracker()
