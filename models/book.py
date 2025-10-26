"""
Book model and related data structures
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict
from datetime import datetime


@dataclass
class Book:
    """Book entity with all metadata"""
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
    
    # ML features
    embedding: Optional[List[float]] = None
    sentiment_score: Optional[float] = None
    popularity_score: Optional[float] = None
    
    def to_dict(self) -> Dict:
        """Convert book to dictionary"""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Book':
        """Create book from dictionary"""
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})
    
    def get_text_representation(self) -> str:
        """Get text representation for ML processing"""
        parts = [
            self.title,
            ' '.join(self.authors),
            ' '.join(self.subjects or []),
            self.description or ''
        ]
        return ' '.join(filter(None, parts))
    
    def calculate_popularity_score(self) -> float:
        """Calculate popularity score based on editions and rating"""
        edition_score = min(self.edition_count / 100, 1.0)  # Normalize to 0-1
        rating_score = (self.rating or 0) / 5.0  # Normalize to 0-1
        return (edition_score * 0.4 + rating_score * 0.6)


@dataclass
class BookRecommendation:
    """Recommendation result with score and reasoning"""
    book: Book
    score: float
    algorithm: str
    reasons: List[str] = field(default_factory=list)
    
    def __lt__(self, other):
        return self.score < other.score
