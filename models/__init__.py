"""
Models package for Book Recommendation System
Contains data models and domain entities
"""

from .book import Book
from .user import UserProfile, ReadingHistory

__all__ = ['Book', 'UserProfile', 'ReadingHistory']
