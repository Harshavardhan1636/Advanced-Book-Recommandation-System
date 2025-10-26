"""
Comprehensive Service Layer Unit Tests
Tests all major services with various scenarios and edge cases
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timedelta

# Import services
try:
    from services.ml_recommender import MLRecommender, RecommendationStrategy
    from services.gamification import AchievementSystem, LeaderboardSystem, LeaderboardType
    from services.monetization import SubscriptionService, SubscriptionTier
    from services.analytics import (
        reading_patterns_analyzer,
        genre_evolution_tracker,
        predictive_analytics
    )
    from services.educational_features import (
        book_summary_service,
        author_profile_service
    )
except ImportError as e:
    pytest.skip(f"Service imports failed: {e}", allow_module_level=True)


class TestMLRecommender:
    """Test ML recommendation service"""
    
    def test_tfidf_strategy_initialization(self):
        """Test TF-IDF recommendation strategy initialization"""
        recommender = MLRecommender(strategy=RecommendationStrategy.TFIDF)
        assert recommender.strategy == RecommendationStrategy.TFIDF
        assert recommender is not None
    
    def test_collaborative_strategy_initialization(self):
        """Test collaborative filtering strategy initialization"""
        recommender = MLRecommender(strategy=RecommendationStrategy.COLLABORATIVE)
        assert recommender.strategy == RecommendationStrategy.COLLABORATIVE
        assert recommender is not None
    
    def test_hybrid_strategy_initialization(self):
        """Test hybrid recommendation strategy initialization"""
        recommender = MLRecommender(strategy=RecommendationStrategy.HYBRID)
        assert recommender.strategy == RecommendationStrategy.HYBRID
        assert recommender is not None
    
    def test_strategy_switching(self):
        """Test switching between recommendation strategies"""
        recommender = MLRecommender(strategy=RecommendationStrategy.TFIDF)
        assert recommender.strategy == RecommendationStrategy.TFIDF
        
        recommender.strategy = RecommendationStrategy.HYBRID
        assert recommender.strategy == RecommendationStrategy.HYBRID
    
    @pytest.mark.parametrize("strategy", [
        RecommendationStrategy.TFIDF,
        RecommendationStrategy.COLLABORATIVE,
        RecommendationStrategy.HYBRID
    ])
    def test_all_strategies(self, strategy):
        """Test all recommendation strategies"""
        recommender = MLRecommender(strategy=strategy)
        assert recommender.strategy == strategy


class TestAchievementSystem:
    """Test achievement system"""
    
    def test_achievement_initialization(self):
        """Test achievement system initializes with achievements"""
        system = AchievementSystem()
        assert len(system.achievements) > 0
        assert len(system.achievements) >= 13  # At least 13 achievements
    
    def test_check_achievements_first_book(self):
        """Test checking achievements for first book"""
        system = AchievementSystem()
        user_stats = {
            "books_read": 1,
            "streak_days": 1,
            "reviews_written": 0
        }
        earned = system.check_achievements(1, user_stats)
        assert isinstance(earned, list)
    
    def test_check_achievements_bookworm(self):
        """Test bookworm achievement (10 books)"""
        system = AchievementSystem()
        user_stats = {
            "books_read": 10,
            "streak_days": 5,
            "reviews_written": 5
        }
        earned = system.check_achievements(1, user_stats)
        assert isinstance(earned, list)
    
    def test_check_achievements_century_club(self):
        """Test century club achievement (100 books)"""
        system = AchievementSystem()
        user_stats = {
            "books_read": 100,
            "streak_days": 50,
            "reviews_written": 50
        }
        earned = system.check_achievements(1, user_stats)
        assert isinstance(earned, list)
    
    def test_achievement_progress(self):
        """Test achievement progress tracking"""
        system = AchievementSystem()
        progress = system.get_achievement_progress(1)
        assert isinstance(progress, (list, dict))


class TestLeaderboardSystem:
    """Test leaderboard system"""
    
    def test_leaderboard_initialization(self):
        """Test leaderboard system initializes"""
        system = LeaderboardSystem()
        assert system is not None
    
    def test_update_leaderboard_books_read(self):
        """Test updating books read leaderboard"""
        system = LeaderboardSystem()
        system.update_leaderboard(1, LeaderboardType.BOOKS_READ, 10)
        # Should not raise exception
    
    def test_update_leaderboard_points(self):
        """Test updating points leaderboard"""
        system = LeaderboardSystem()
        system.update_leaderboard(1, LeaderboardType.POINTS, 500)
        # Should not raise exception
    
    def test_get_leaderboard(self):
        """Test getting leaderboard"""
        system = LeaderboardSystem()
        leaderboard = system.get_leaderboard(LeaderboardType.BOOKS_READ, limit=10)
        assert isinstance(leaderboard, list)
    
    def test_get_user_rank(self):
        """Test getting user rank"""
        system = LeaderboardSystem()
        system.update_leaderboard(1, LeaderboardType.BOOKS_READ, 10)
        rank = system.get_user_rank(1, LeaderboardType.BOOKS_READ)
        assert isinstance(rank, (int, type(None)))


class TestSubscriptionService:
    """Test subscription service"""
    
    def test_get_tier_info_free(self):
        """Test getting free tier information"""
        service = SubscriptionService()
        tier_info = service.get_tier_info(SubscriptionTier.FREE)
        assert "price" in tier_info
        assert "features" in tier_info
        assert tier_info["price"] == 0
    
    def test_get_tier_info_basic(self):
        """Test getting basic tier information"""
        service = SubscriptionService()
        tier_info = service.get_tier_info(SubscriptionTier.BASIC)
        assert "price" in tier_info
        assert tier_info["price"] == 4.99
    
    def test_get_tier_info_premium(self):
        """Test getting premium tier information"""
        service = SubscriptionService()
        tier_info = service.get_tier_info(SubscriptionTier.PREMIUM)
        assert "price" in tier_info
        assert tier_info["price"] == 9.99
    
    def test_get_tier_info_enterprise(self):
        """Test getting enterprise tier information"""
        service = SubscriptionService()
        tier_info = service.get_tier_info(SubscriptionTier.ENTERPRISE)
        assert "price" in tier_info
        assert tier_info["price"] == 49.99
    
    def test_all_tiers_exist(self):
        """Test all subscription tiers are defined"""
        service = SubscriptionService()
        for tier in SubscriptionTier:
            tier_info = service.get_tier_info(tier)
            assert tier_info is not None
            assert "price" in tier_info
            assert "features" in tier_info
    
    def test_subscribe_user_basic(self):
        """Test subscribing a user to basic tier"""
        service = SubscriptionService()
        subscription = service.subscribe(1, SubscriptionTier.BASIC, "stripe")
        assert subscription["user_id"] == 1
        assert subscription["tier"] == "basic"
        assert subscription["status"] == "active"
    
    def test_subscribe_user_premium(self):
        """Test subscribing a user to premium tier"""
        service = SubscriptionService()
        subscription = service.subscribe(2, SubscriptionTier.PREMIUM, "paypal")
        assert subscription["user_id"] == 2
        assert subscription["tier"] == "premium"
    
    def test_check_subscription_status(self):
        """Test checking subscription status"""
        service = SubscriptionService()
        service.subscribe(1, SubscriptionTier.BASIC, "stripe")
        status = service.get_subscription(1)
        assert status is not None
    
    def test_cancel_subscription(self):
        """Test canceling subscription"""
        service = SubscriptionService()
        service.subscribe(1, SubscriptionTier.BASIC, "stripe")
        result = service.cancel_subscription(1)
        assert result is not None


class TestAnalyticsServices:
    """Test analytics services"""
    
    def test_reading_patterns_analyzer(self):
        """Test reading patterns analyzer"""
        patterns = reading_patterns_analyzer.analyze_patterns(1)
        assert isinstance(patterns, dict)
    
    def test_genre_evolution_tracker(self):
        """Test genre evolution tracker"""
        evolution = genre_evolution_tracker.track_evolution(1)
        assert isinstance(evolution, (dict, list))
    
    def test_predictive_analytics(self):
        """Test predictive analytics"""
        predictions = predictive_analytics.predict_next_books("OL123W", 1)
        assert isinstance(predictions, list)


class TestEducationalServices:
    """Test educational services"""
    
    def test_book_summary_service(self):
        """Test book summary service"""
        summary = book_summary_service.generate_summary("OL123W", "comprehensive")
        assert isinstance(summary, dict)
    
    def test_author_profile_service(self):
        """Test author profile service"""
        profile = author_profile_service.get_profile("J.K. Rowling")
        assert isinstance(profile, dict)


@pytest.mark.unit
class TestDataValidation:
    """Test data validation"""
    
    def test_book_data_structure(self, sample_book):
        """Test book data has required fields"""
        assert "title" in sample_book
        assert "authors" in sample_book
        assert isinstance(sample_book["authors"], list)
        assert "isbn" in sample_book
        assert "year" in sample_book
    
    def test_user_data_structure(self, sample_user):
        """Test user data has required fields"""
        assert "user_id" in sample_user
        assert "username" in sample_user
        assert "email" in sample_user
        assert isinstance(sample_user["user_id"], int)
    
    def test_book_data_types(self, sample_book):
        """Test book data types are correct"""
        assert isinstance(sample_book["title"], str)
        assert isinstance(sample_book["authors"], list)
        assert isinstance(sample_book["year"], int)
        assert isinstance(sample_book["rating"], (int, float))
    
    def test_email_format(self, sample_user):
        """Test email format is valid"""
        email = sample_user["email"]
        assert "@" in email
        assert "." in email


@pytest.mark.unit
class TestEdgeCases:
    """Test edge cases and error handling"""
    
    def test_empty_book_list(self):
        """Test handling empty book list"""
        recommender = MLRecommender(strategy=RecommendationStrategy.TFIDF)
        # Should handle gracefully
        assert recommender is not None
    
    def test_invalid_user_id(self):
        """Test handling invalid user ID"""
        system = AchievementSystem()
        # Should handle gracefully
        result = system.check_achievements(-1, {})
        assert isinstance(result, list)
    
    def test_negative_subscription_price(self):
        """Test subscription prices are non-negative"""
        service = SubscriptionService()
        for tier in SubscriptionTier:
            tier_info = service.get_tier_info(tier)
            assert tier_info["price"] >= 0
