"""
Services package for Book Recommendation System
Contains business logic and external service integrations
"""

from .api_providers import APIProviderFactory, OpenLibraryProvider, GoogleBooksProvider
from .recommendation_engine import RecommendationEngine
from .ml_recommender import MLRecommender, TFIDFRecommender, CollaborativeFilteringRecommender

__all__ = [
    'APIProviderFactory',
    'OpenLibraryProvider',
    'GoogleBooksProvider',
    'RecommendationEngine',
    'MLRecommender',
    'TFIDFRecommender',
    'CollaborativeFilteringRecommender'
]
