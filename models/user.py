"""
User profile and reading history models
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime
import json
from pathlib import Path


@dataclass
class ReadingHistory:
    """Single reading history entry"""
    book_id: str
    title: str
    authors: List[str]
    rating: Optional[float] = None
    read_date: Optional[str] = None
    status: str = "read"  # read, reading, want_to_read
    review: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            'book_id': self.book_id,
            'title': self.title,
            'authors': self.authors,
            'rating': self.rating,
            'read_date': self.read_date,
            'status': self.status,
            'review': self.review,
            'tags': self.tags
        }


@dataclass
class UserProfile:
    """User profile with preferences and history"""
    user_id: str
    name: str = "User"
    reading_history: List[ReadingHistory] = field(default_factory=list)
    favorite_genres: List[str] = field(default_factory=list)
    favorite_authors: List[str] = field(default_factory=list)
    preferences: Dict = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    
    def add_to_history(self, history_entry: ReadingHistory):
        """Add book to reading history"""
        self.reading_history.append(history_entry)
        self._update_preferences()
    
    def _update_preferences(self):
        """Update preferences based on reading history"""
        # Extract favorite genres from history
        genre_counts = {}
        author_counts = {}
        
        for entry in self.reading_history:
            if entry.rating and entry.rating >= 4.0:
                for author in entry.authors:
                    author_counts[author] = author_counts.get(author, 0) + 1
                
                for tag in entry.tags:
                    genre_counts[tag] = genre_counts.get(tag, 0) + 1
        
        # Update favorites
        self.favorite_authors = sorted(author_counts.keys(), 
                                      key=lambda x: author_counts[x], 
                                      reverse=True)[:10]
        self.favorite_genres = sorted(genre_counts.keys(), 
                                     key=lambda x: genre_counts[x], 
                                     reverse=True)[:10]
    
    def get_average_rating(self) -> float:
        """Get user's average rating"""
        ratings = [h.rating for h in self.reading_history if h.rating]
        return sum(ratings) / len(ratings) if ratings else 0.0
    
    def get_read_books_count(self) -> int:
        """Get count of read books"""
        return len([h for h in self.reading_history if h.status == "read"])
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            'user_id': self.user_id,
            'name': self.name,
            'reading_history': [h.to_dict() for h in self.reading_history],
            'favorite_genres': self.favorite_genres,
            'favorite_authors': self.favorite_authors,
            'preferences': self.preferences,
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'UserProfile':
        """Create from dictionary"""
        history = [ReadingHistory(**h) for h in data.get('reading_history', [])]
        return cls(
            user_id=data['user_id'],
            name=data.get('name', 'User'),
            reading_history=history,
            favorite_genres=data.get('favorite_genres', []),
            favorite_authors=data.get('favorite_authors', []),
            preferences=data.get('preferences', {}),
            created_at=data.get('created_at', datetime.now().isoformat())
        )
    
    def save(self, filepath: Path):
        """Save profile to file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, indent=2, ensure_ascii=False)
    
    @classmethod
    def load(cls, filepath: Path) -> Optional['UserProfile']:
        """Load profile from file"""
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return cls.from_dict(data)
        except Exception:
            return None
