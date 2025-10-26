"""
Advanced Features for Book Recommendation System
- Reading time calculator
- Natural language search
- Price comparison (mock)
- Reading streak tracking
"""

import re
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict

from models.book import Book
from models.user import UserProfile


class ReadingTimeCalculator:
    """Calculate estimated reading time for books"""
    
    # Average reading speeds (words per minute)
    SPEEDS = {
        'slow': 200,
        'average': 250,
        'fast': 300
    }
    
    # Average words per page
    WORDS_PER_PAGE = 250
    
    @classmethod
    def calculate_reading_time(cls, page_count: int, speed: str = 'average') -> Dict:
        """
        Calculate reading time for a book
        
        Returns:
            Dict with hours, minutes, and formatted string
        """
        if not page_count:
            return {'hours': 0, 'minutes': 0, 'formatted': 'Unknown'}
        
        total_words = page_count * cls.WORDS_PER_PAGE
        wpm = cls.SPEEDS.get(speed, cls.SPEEDS['average'])
        total_minutes = total_words / wpm
        
        hours = int(total_minutes // 60)
        minutes = int(total_minutes % 60)
        
        if hours > 0:
            formatted = f"{hours}h {minutes}m"
        else:
            formatted = f"{minutes}m"
        
        return {
            'hours': hours,
            'minutes': minutes,
            'total_minutes': int(total_minutes),
            'formatted': formatted,
            'speed': speed
        }
    
    @classmethod
    def calculate_daily_reading_goal(cls, page_count: int, days: int, speed: str = 'average') -> Dict:
        """Calculate pages per day to finish book in given days"""
        if not page_count or days <= 0:
            return {'pages_per_day': 0, 'minutes_per_day': 0}
        
        pages_per_day = page_count / days
        time_per_day = cls.calculate_reading_time(int(pages_per_day), speed)
        
        return {
            'pages_per_day': round(pages_per_day, 1),
            'minutes_per_day': time_per_day['total_minutes'],
            'formatted': f"{round(pages_per_day, 1)} pages/day ({time_per_day['formatted']}/day)"
        }


class NaturalLanguageSearch:
    """Enhanced search with natural language understanding"""
    
    # Mood keywords mapping
    MOOD_KEYWORDS = {
        'dark': ['dark', 'grim', 'noir', 'dystopian', 'gothic'],
        'light': ['light', 'cheerful', 'uplifting', 'happy', 'fun'],
        'intense': ['intense', 'gripping', 'thrilling', 'suspenseful'],
        'relaxing': ['relaxing', 'cozy', 'gentle', 'calm', 'peaceful'],
        'emotional': ['emotional', 'moving', 'touching', 'heartfelt'],
        'funny': ['funny', 'humorous', 'comedy', 'hilarious', 'witty']
    }
    
    # Comparison keywords
    COMPARISON_KEYWORDS = ['like', 'similar to', 'reminds me of', 'in the style of']
    
    @classmethod
    def parse_query(cls, query: str) -> Dict:
        """
        Parse natural language query into structured search parameters
        
        Examples:
            "books like Harry Potter but darker" -> base: Harry Potter, mood: dark
            "funny science fiction" -> genre: science fiction, mood: funny
        """
        query_lower = query.lower()
        result = {
            'base_query': query,
            'reference_book': None,
            'mood': None,
            'genre': None,
            'modifiers': []
        }
        
        # Check for comparison
        for keyword in cls.COMPARISON_KEYWORDS:
            if keyword in query_lower:
                parts = query_lower.split(keyword)
                if len(parts) > 1:
                    result['reference_book'] = parts[1].split('but')[0].strip()
                    result['base_query'] = result['reference_book']
                break
        
        # Check for mood keywords
        for mood, keywords in cls.MOOD_KEYWORDS.items():
            if any(kw in query_lower for kw in keywords):
                result['mood'] = mood
                result['modifiers'].append(mood)
                break
        
        # Extract "but" modifiers
        if 'but' in query_lower:
            modifier = query_lower.split('but')[1].strip()
            result['modifiers'].append(modifier)
        
        return result
    
    @classmethod
    def enhance_search_results(cls, books: List[Book], parsed_query: Dict) -> List[Book]:
        """Filter and rank books based on parsed query"""
        if not parsed_query.get('mood'):
            return books
        
        mood = parsed_query['mood']
        mood_keywords = cls.MOOD_KEYWORDS.get(mood, [])
        
        # Score books based on mood match
        scored_books = []
        for book in books:
            score = 0
            if book.subjects:
                book_text = ' '.join(book.subjects).lower()
                score = sum(1 for kw in mood_keywords if kw in book_text)
            
            if book.description:
                desc_lower = book.description.lower()
                score += sum(0.5 for kw in mood_keywords if kw in desc_lower)
            
            if score > 0:
                scored_books.append((book, score))
        
        # Sort by score
        scored_books.sort(key=lambda x: x[1], reverse=True)
        return [book for book, score in scored_books]


class ReadingStreakTracker:
    """Track reading streaks and habits"""
    
    @staticmethod
    def calculate_streak(user_profile: UserProfile) -> Dict:
        """Calculate current reading streak"""
        if not user_profile.reading_history:
            return {
                'current_streak': 0,
                'longest_streak': 0,
                'total_days': 0
            }
        
        # Get reading dates
        dates = []
        for entry in user_profile.reading_history:
            if entry.read_date:
                try:
                    date = datetime.fromisoformat(entry.read_date).date()
                    dates.append(date)
                except:
                    pass
        
        if not dates:
            return {'current_streak': 0, 'longest_streak': 0, 'total_days': 0}
        
        dates = sorted(set(dates))
        
        # Calculate current streak
        current_streak = 0
        today = datetime.now().date()
        check_date = today
        
        for date in reversed(dates):
            if date == check_date or date == check_date - timedelta(days=1):
                current_streak += 1
                check_date = date - timedelta(days=1)
            else:
                break
        
        # Calculate longest streak
        longest_streak = 1
        temp_streak = 1
        
        for i in range(1, len(dates)):
            if (dates[i] - dates[i-1]).days == 1:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1
        
        return {
            'current_streak': current_streak,
            'longest_streak': longest_streak,
            'total_days': len(dates),
            'last_read': dates[-1].isoformat() if dates else None
        }
    
    @staticmethod
    def get_reading_habits(user_profile: UserProfile) -> Dict:
        """Analyze reading habits"""
        if not user_profile.reading_history:
            return {}
        
        # Books per month
        monthly_counts = defaultdict(int)
        genre_counts = defaultdict(int)
        
        for entry in user_profile.reading_history:
            if entry.read_date:
                try:
                    date = datetime.fromisoformat(entry.read_date)
                    month_key = f"{date.year}-{date.month:02d}"
                    monthly_counts[month_key] += 1
                except:
                    pass
            
            for tag in entry.tags:
                genre_counts[tag] += 1
        
        avg_books_per_month = sum(monthly_counts.values()) / len(monthly_counts) if monthly_counts else 0
        
        return {
            'average_books_per_month': round(avg_books_per_month, 1),
            'most_active_month': max(monthly_counts.items(), key=lambda x: x[1])[0] if monthly_counts else None,
            'favorite_genres': sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:5],
            'total_books': len(user_profile.reading_history)
        }


class PriceComparison:
    """Mock price comparison service (would integrate with real APIs)"""
    
    @staticmethod
    def get_prices(isbn: str) -> List[Dict]:
        """Get book prices from multiple sources (mock data)"""
        # In production, integrate with:
        # - Amazon Product Advertising API
        # - Google Books API
        # - Barnes & Noble API
        # - Book Depository API
        
        if not isbn:
            return []
        
        # Mock data for demonstration
        return [
            {
                'source': 'Amazon',
                'price': 12.99,
                'currency': 'USD',
                'format': 'Paperback',
                'url': f'https://amazon.com/dp/{isbn}',
                'availability': 'In Stock'
            },
            {
                'source': 'Barnes & Noble',
                'price': 13.49,
                'currency': 'USD',
                'format': 'Paperback',
                'url': f'https://barnesandnoble.com/w/{isbn}',
                'availability': 'In Stock'
            },
            {
                'source': 'Book Depository',
                'price': 11.99,
                'currency': 'USD',
                'format': 'Paperback',
                'url': f'https://bookdepository.com/{isbn}',
                'availability': 'Usually dispatched within 24 hours'
            }
        ]
    
    @staticmethod
    def get_best_price(isbn: str) -> Optional[Dict]:
        """Get the best price from all sources"""
        prices = PriceComparison.get_prices(isbn)
        if not prices:
            return None
        
        return min(prices, key=lambda x: x['price'])


class LibraryAvailability:
    """Check library availability (mock - would integrate with OverDrive API)"""
    
    @staticmethod
    def check_availability(isbn: str, zip_code: str = None) -> Dict:
        """Check if book is available in local libraries"""
        # In production, integrate with:
        # - OverDrive API
        # - Libby API
        # - WorldCat API
        
        # Mock data
        return {
            'available': True,
            'libraries': [
                {
                    'name': 'Central Library',
                    'distance': '2.3 miles',
                    'copies_available': 3,
                    'total_copies': 5,
                    'wait_time': 'Available now'
                },
                {
                    'name': 'Branch Library',
                    'distance': '4.1 miles',
                    'copies_available': 0,
                    'total_copies': 2,
                    'wait_time': '2 weeks'
                }
            ],
            'digital_available': True,
            'digital_wait_time': 'Available now'
        }
