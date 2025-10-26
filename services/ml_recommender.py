"""
Machine Learning-based recommendation algorithms
Implements TF-IDF, Collaborative Filtering, and Hybrid approaches
"""

import logging
import numpy as np
from typing import List, Dict, Optional, Tuple
from abc import ABC, abstractmethod
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

from models.book import Book, BookRecommendation
from models.user import UserProfile

logger = logging.getLogger(__name__)


class RecommendationStrategy(ABC):
    """Abstract base class for recommendation strategies"""
    
    @abstractmethod
    def recommend(self, target_book: Book, candidates: List[Book], user_profile: Optional[UserProfile] = None, top_n: int = 10) -> List[BookRecommendation]:
        """Generate recommendations"""
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """Get strategy name"""
        pass


class TFIDFRecommender(RecommendationStrategy):
    """Content-based filtering using TF-IDF and cosine similarity"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1
        )
        self.fitted = False
    
    def get_name(self) -> str:
        return "TF-IDF Content-Based"
    
    def recommend(self, target_book: Book, candidates: List[Book], user_profile: Optional[UserProfile] = None, top_n: int = 10) -> List[BookRecommendation]:
        """Recommend books using TF-IDF similarity"""
        try:
            # Prepare text representations
            all_books = [target_book] + candidates
            texts = [self._preprocess_text(book.get_text_representation()) for book in all_books]
            
            # Compute TF-IDF matrix
            tfidf_matrix = self.vectorizer.fit_transform(texts)
            
            # Calculate cosine similarity
            similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
            
            # Create recommendations
            recommendations = []
            for idx, score in enumerate(similarities):
                if score > 0.1:  # Threshold for relevance
                    book = candidates[idx]
                    reasons = self._generate_reasons(target_book, book, score)
                    
                    # Boost score based on user preferences
                    if user_profile:
                        score = self._apply_user_boost(score, book, user_profile)
                    
                    recommendations.append(BookRecommendation(
                        book=book,
                        score=float(score),
                        algorithm=self.get_name(),
                        reasons=reasons
                    ))
            
            # Sort and return top N
            recommendations.sort(reverse=True)
            logger.info(f"[TF-IDF] Generated {len(recommendations[:top_n])} recommendations")
            return recommendations[:top_n]
            
        except Exception as e:
            logger.error(f"[TF-IDF] Recommendation failed: {e}")
            return []
    
    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for TF-IDF"""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s]', '', text)
        return text
    
    def _generate_reasons(self, target: Book, candidate: Book, score: float) -> List[str]:
        """Generate explanation for recommendation"""
        reasons = []
        
        # Check author overlap
        common_authors = set(target.authors) & set(candidate.authors)
        if common_authors:
            reasons.append(f"Same author: {', '.join(common_authors)}")
        
        # Check subject overlap
        if target.subjects and candidate.subjects:
            common_subjects = set(target.subjects[:5]) & set(candidate.subjects[:5])
            if common_subjects:
                reasons.append(f"Similar topics: {', '.join(list(common_subjects)[:3])}")
        
        # Similarity score
        reasons.append(f"Content similarity: {score:.2%}")
        
        # Rating
        if candidate.rating:
            reasons.append(f"Rating: {candidate.rating:.1f}/5.0")
        
        return reasons
    
    def _apply_user_boost(self, score: float, book: Book, user_profile: UserProfile) -> float:
        """Boost score based on user preferences"""
        boost = 1.0
        
        # Boost for favorite authors
        if any(author in user_profile.favorite_authors for author in book.authors):
            boost *= 1.3
        
        # Boost for favorite genres
        if book.subjects:
            if any(subject in user_profile.favorite_genres for subject in book.subjects):
                boost *= 1.2
        
        return min(score * boost, 1.0)


class CollaborativeFilteringRecommender(RecommendationStrategy):
    """Collaborative filtering based on user behavior patterns"""
    
    def __init__(self):
        self.user_item_matrix = defaultdict(lambda: defaultdict(float))
        self.item_similarity = {}
    
    def get_name(self) -> str:
        return "Collaborative Filtering"
    
    def recommend(self, target_book: Book, candidates: List[Book], user_profile: Optional[UserProfile] = None, top_n: int = 10) -> List[BookRecommendation]:
        """Recommend books using collaborative filtering"""
        if not user_profile or not user_profile.reading_history:
            logger.warning("[CF] No user history available, falling back to popularity")
            return self._popularity_based_recommendations(candidates, top_n)
        
        try:
            # Build user-item interactions
            self._build_user_item_matrix(user_profile)
            
            # Calculate item-based similarities
            recommendations = []
            
            for candidate in candidates:
                score = self._calculate_cf_score(candidate, user_profile)
                
                if score > 0:
                    reasons = self._generate_cf_reasons(candidate, user_profile, score)
                    recommendations.append(BookRecommendation(
                        book=candidate,
                        score=score,
                        algorithm=self.get_name(),
                        reasons=reasons
                    ))
            
            recommendations.sort(reverse=True)
            logger.info(f"[CF] Generated {len(recommendations[:top_n])} recommendations")
            return recommendations[:top_n]
            
        except Exception as e:
            logger.error(f"[CF] Recommendation failed: {e}")
            return self._popularity_based_recommendations(candidates, top_n)
    
    def _build_user_item_matrix(self, user_profile: UserProfile):
        """Build user-item interaction matrix"""
        for entry in user_profile.reading_history:
            rating = entry.rating or 3.0
            self.user_item_matrix[user_profile.user_id][entry.book_id] = rating
    
    def _calculate_cf_score(self, book: Book, user_profile: UserProfile) -> float:
        """Calculate collaborative filtering score"""
        # Simple implementation: weighted by user's ratings of similar books
        score = 0.0
        count = 0
        
        for entry in user_profile.reading_history:
            if entry.rating and entry.rating >= 4.0:
                # Check similarity (simplified: author or subject overlap)
                similarity = self._calculate_item_similarity(book, entry)
                if similarity > 0:
                    score += entry.rating * similarity
                    count += 1
        
        return (score / count) / 5.0 if count > 0 else 0.0
    
    def _calculate_item_similarity(self, book: Book, history_entry) -> float:
        """Calculate similarity between books"""
        similarity = 0.0
        
        # Author similarity
        if any(author in history_entry.authors for author in book.authors):
            similarity += 0.5
        
        # Genre similarity (using tags as proxy)
        if book.subjects and history_entry.tags:
            common = set(book.subjects[:5]) & set(history_entry.tags)
            if common:
                similarity += 0.3 * (len(common) / max(len(book.subjects[:5]), len(history_entry.tags)))
        
        return min(similarity, 1.0)
    
    def _generate_cf_reasons(self, book: Book, user_profile: UserProfile, score: float) -> List[str]:
        """Generate reasons for CF recommendation"""
        reasons = []
        
        # Find similar books user liked
        similar_liked = []
        for entry in user_profile.reading_history:
            if entry.rating and entry.rating >= 4.0:
                if any(author in entry.authors for author in book.authors):
                    similar_liked.append(entry.title)
        
        if similar_liked:
            reasons.append(f"You enjoyed: {similar_liked[0]}")
        
        reasons.append(f"Match score: {score:.2%}")
        
        if book.rating:
            reasons.append(f"Community rating: {book.rating:.1f}/5.0")
        
        return reasons
    
    def _popularity_based_recommendations(self, candidates: List[Book], top_n: int) -> List[BookRecommendation]:
        """Fallback to popularity-based recommendations"""
        recommendations = []
        
        for book in candidates:
            if book.popularity_score:
                recommendations.append(BookRecommendation(
                    book=book,
                    score=book.popularity_score,
                    algorithm="Popularity-Based",
                    reasons=[f"Popular book with {book.edition_count} editions"]
                ))
        
        recommendations.sort(reverse=True)
        return recommendations[:top_n]


class MLRecommender(RecommendationStrategy):
    """Hybrid recommender combining multiple strategies"""
    
    def __init__(self):
        self.strategies = [
            TFIDFRecommender(),
            CollaborativeFilteringRecommender()
        ]
        self.weights = {
            "TF-IDF Content-Based": 0.6,
            "Collaborative Filtering": 0.4
        }
    
    def get_name(self) -> str:
        return "Hybrid ML"
    
    def recommend(self, target_book: Book, candidates: List[Book], user_profile: Optional[UserProfile] = None, top_n: int = 10) -> List[BookRecommendation]:
        """Generate hybrid recommendations"""
        try:
            # Get recommendations from each strategy
            all_recommendations = {}
            
            for strategy in self.strategies:
                recs = strategy.recommend(target_book, candidates, user_profile, top_n=top_n*2)
                weight = self.weights.get(strategy.get_name(), 0.5)
                
                for rec in recs:
                    book_id = rec.book.work_id or rec.book.title
                    if book_id not in all_recommendations:
                        all_recommendations[book_id] = {
                            'book': rec.book,
                            'scores': [],
                            'reasons': set(),
                            'algorithms': []
                        }
                    
                    all_recommendations[book_id]['scores'].append(rec.score * weight)
                    all_recommendations[book_id]['reasons'].update(rec.reasons)
                    all_recommendations[book_id]['algorithms'].append(rec.algorithm)
            
            # Combine scores
            hybrid_recommendations = []
            for book_id, data in all_recommendations.items():
                combined_score = sum(data['scores']) / len(self.strategies)
                
                # Boost if multiple algorithms agree
                if len(data['algorithms']) > 1:
                    combined_score *= 1.2
                
                reasons = list(data['reasons'])[:4]
                reasons.append(f"Recommended by: {', '.join(data['algorithms'])}")
                
                hybrid_recommendations.append(BookRecommendation(
                    book=data['book'],
                    score=min(combined_score, 1.0),
                    algorithm=self.get_name(),
                    reasons=reasons
                ))
            
            # Sort and return top N
            hybrid_recommendations.sort(reverse=True)
            logger.info(f"[Hybrid] Generated {len(hybrid_recommendations[:top_n])} recommendations")
            return hybrid_recommendations[:top_n]
            
        except Exception as e:
            logger.error(f"[Hybrid] Recommendation failed: {e}")
            # Fallback to single strategy
            return self.strategies[0].recommend(target_book, candidates, user_profile, top_n)
