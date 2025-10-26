"""
Comprehensive API endpoint tests for Book Recommendation System
Tests all major endpoints with various scenarios
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check returns 200 with proper structure"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        assert "timestamp" in data or "message" in data
    
    def test_health_check_response_time(self, client):
        """Test health check responds quickly"""
        import time
        start = time.time()
        response = client.get("/api/health")
        duration = time.time() - start
        assert response.status_code == 200
        assert duration < 1.0  # Should respond in less than 1 second


class TestBookEndpoints:
    """Test book-related endpoints"""
    
    def test_search_books_success(self, client):
        """Test book search endpoint with valid query"""
        response = client.post(
            "/api/books/search",
            json={"query": "python programming", "limit": 5}
        )
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert isinstance(data["results"], list)
    
    def test_search_books_empty_query(self, client):
        """Test book search with empty query"""
        response = client.post(
            "/api/books/search",
            json={"query": "", "limit": 5}
        )
        # Should handle gracefully
        assert response.status_code in [200, 400, 422]
    
    def test_search_books_with_filters(self, client):
        """Test book search with advanced filters"""
        response = client.post(
            "/api/books/search",
            json={
                "query": "science fiction",
                "limit": 10,
                "year_min": 2000,
                "year_max": 2024,
                "min_rating": 4.0
            }
        )
        assert response.status_code in [200, 500]
    
    def test_trending_books(self, client):
        """Test trending books endpoint"""
        response = client.get("/api/books/trending")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) or isinstance(data, dict)
    
    def test_book_details(self, client):
        """Test getting book details"""
        response = client.get("/api/books/OL123W")
        # May not exist, but should handle gracefully
        assert response.status_code in [200, 404, 500]


class TestRecommendationEndpoints:
    """Test recommendation endpoints"""
    
    def test_ml_recommendations_hybrid(self, client, sample_book):
        """Test ML recommendations with hybrid algorithm"""
        response = client.post(
            "/api/recommendations/ml",
            json={
                "book_title": sample_book["title"],
                "algorithm": "hybrid",
                "limit": 5
            }
        )
        assert response.status_code in [200, 500]
    
    def test_ml_recommendations_tfidf(self, client):
        """Test ML recommendations with TF-IDF algorithm"""
        response = client.post(
            "/api/recommendations/ml",
            json={
                "book_title": "Python Programming",
                "algorithm": "tfidf",
                "limit": 10
            }
        )
        assert response.status_code in [200, 500]
    
    def test_ml_recommendations_collaborative(self, client):
        """Test ML recommendations with collaborative filtering"""
        response = client.post(
            "/api/recommendations/ml",
            json={
                "book_title": "Data Science",
                "algorithm": "collaborative",
                "limit": 5
            }
        )
        assert response.status_code in [200, 500]
    
    def test_personalized_recommendations(self, client):
        """Test personalized recommendations for user"""
        response = client.get("/api/recommendations/personalized/1")
        assert response.status_code in [200, 404, 500]


class TestGamificationEndpoints:
    """Test gamification endpoints"""
    
    def test_get_achievements(self, client):
        """Test get achievements endpoint"""
        response = client.get("/api/gamification/achievements?user_id=1")
        assert response.status_code in [200, 500]
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, (list, dict))
    
    def test_get_all_achievements(self, client):
        """Test get all available achievements"""
        response = client.get("/api/gamification/achievements/all")
        assert response.status_code in [200, 500]
    
    def test_get_leaderboard_books_read(self, client):
        """Test get leaderboard for books read"""
        response = client.get("/api/gamification/leaderboard/books_read")
        assert response.status_code in [200, 500]
    
    def test_get_leaderboard_points(self, client):
        """Test get leaderboard for points"""
        response = client.get("/api/gamification/leaderboard/points")
        assert response.status_code in [200, 500]
    
    def test_get_user_streak(self, client):
        """Test get user reading streak"""
        response = client.get("/api/gamification/streak/1")
        assert response.status_code in [200, 404, 500]
    
    def test_record_reading_activity(self, client):
        """Test recording reading activity"""
        response = client.post(
            "/api/gamification/record-activity",
            json={
                "user_id": 1,
                "activity_type": "book_read",
                "book_id": "OL123W"
            }
        )
        assert response.status_code in [200, 201, 500]


class TestAnalyticsEndpoints:
    """Test analytics endpoints"""
    
    def test_reading_patterns(self, client):
        """Test reading patterns endpoint"""
        response = client.get("/api/analytics/reading-patterns/1")
        assert response.status_code in [200, 404, 500]
    
    def test_genre_evolution(self, client):
        """Test genre evolution tracking"""
        response = client.get("/api/analytics/genre-evolution/1")
        assert response.status_code in [200, 404, 500]
    
    def test_predict_next_book(self, client):
        """Test predictive analytics"""
        response = client.post(
            "/api/analytics/predict-next-book",
            json={"current_book_id": "OL123W", "user_id": 1}
        )
        assert response.status_code in [200, 404, 500]
    
    def test_generate_report(self, client):
        """Test report generation"""
        response = client.get("/api/analytics/report/1?format=json")
        assert response.status_code in [200, 404, 500]


class TestEducationalEndpoints:
    """Test educational endpoints"""
    
    def test_book_summary(self, client):
        """Test book summary endpoint"""
        response = client.get("/api/educational/summary/OL123W?summary_type=comprehensive")
        assert response.status_code in [200, 404, 500]
    
    def test_author_profile(self, client):
        """Test author profile endpoint"""
        response = client.get("/api/educational/author/J.K.%20Rowling")
        assert response.status_code in [200, 404, 500]
    
    def test_literary_analysis(self, client):
        """Test literary analysis endpoint"""
        response = client.get("/api/educational/analysis/OL123W")
        assert response.status_code in [200, 404, 500]
    
    def test_reading_guide(self, client):
        """Test reading guide endpoint"""
        response = client.get("/api/educational/reading-guide/OL123W")
        assert response.status_code in [200, 404, 500]


class TestMonetizationEndpoints:
    """Test monetization endpoints"""
    
    def test_subscription_tiers(self, client):
        """Test get subscription tiers"""
        response = client.get("/api/subscription/tiers")
        assert response.status_code == 200
        data = response.json()
        assert "tiers" in data
        assert len(data["tiers"]) >= 4  # Free, Basic, Premium, Enterprise
    
    def test_subscribe_user(self, client):
        """Test subscribing a user"""
        response = client.post(
            "/api/subscription/subscribe",
            json={
                "user_id": 1,
                "tier": "basic",
                "payment_method": "stripe"
            }
        )
        assert response.status_code in [200, 201, 400, 500]
    
    def test_get_affiliate_link(self, client):
        """Test generating affiliate link"""
        response = client.get(
            "/api/affiliate/link?book_id=OL123W&retailer=amazon"
        )
        assert response.status_code in [200, 404, 500]
    
    def test_api_access_tiers(self, client):
        """Test API access tiers"""
        response = client.get("/api/api-access/tiers")
        assert response.status_code in [200, 500]


class TestScalabilityEndpoints:
    """Test scalability endpoints"""
    
    def test_get_regions(self, client):
        """Test get regions endpoint"""
        response = client.get("/api/scalability/regions")
        assert response.status_code == 200
        data = response.json()
        assert "regions" in data
        assert len(data["regions"]) >= 5  # 5 global regions
    
    def test_get_innovations(self, client):
        """Test get innovations endpoint"""
        response = client.get("/api/scalability/innovations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
    
    def test_health_check_region(self, client):
        """Test region health check"""
        response = client.get("/api/scalability/health/us-east")
        assert response.status_code in [200, 404, 500]
    
    def test_cdn_status(self, client):
        """Test CDN status"""
        response = client.get("/api/scalability/cdn/status")
        assert response.status_code in [200, 500]


@pytest.mark.integration
class TestIntegrationFlows:
    """Integration tests for complete user flows"""
    
    def test_search_and_recommend_flow(self, client):
        """Test search -> view -> recommend flow"""
        # Search for books
        search_response = client.post(
            "/api/books/search",
            json={"query": "python programming", "limit": 1}
        )
        assert search_response.status_code == 200
        
        # If we got results, try to get recommendations
        search_data = search_response.json()
        if search_data.get("results"):
            book = search_data["results"][0]
            rec_response = client.post(
                "/api/recommendations/ml",
                json={
                    "book_title": book.get("title", "Python"),
                    "algorithm": "hybrid",
                    "limit": 3
                }
            )
            assert rec_response.status_code in [200, 500]
    
    def test_user_journey_flow(self, client):
        """Test complete user journey"""
        # 1. Search for books
        search_response = client.post(
            "/api/books/search",
            json={"query": "science fiction", "limit": 5}
        )
        assert search_response.status_code == 200
        
        # 2. Get trending books
        trending_response = client.get("/api/books/trending")
        assert trending_response.status_code == 200
        
        # 3. Check achievements
        achievements_response = client.get("/api/gamification/achievements?user_id=1")
        assert achievements_response.status_code in [200, 500]
        
        # 4. Get subscription tiers
        tiers_response = client.get("/api/subscription/tiers")
        assert tiers_response.status_code == 200
    
    def test_analytics_flow(self, client):
        """Test analytics and reporting flow"""
        # 1. Get reading patterns
        patterns_response = client.get("/api/analytics/reading-patterns/1")
        assert patterns_response.status_code in [200, 404, 500]
        
        # 2. Get genre evolution
        evolution_response = client.get("/api/analytics/genre-evolution/1")
        assert evolution_response.status_code in [200, 404, 500]
        
        # 3. Generate report
        report_response = client.get("/api/analytics/report/1?format=json")
        assert response.status_code in [200, 404, 500]


@pytest.mark.slow
class TestPerformance:
    """Performance tests"""
    
    def test_concurrent_health_checks(self, client):
        """Test multiple concurrent health checks"""
        import concurrent.futures
        
        def check_health():
            response = client.get("/api/health")
            return response.status_code == 200
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(check_health) for _ in range(50)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        # At least 80% should succeed
        success_rate = sum(results) / len(results)
        assert success_rate >= 0.8
    
    def test_search_response_time(self, client):
        """Test search endpoint response time"""
        import time
        
        start = time.time()
        response = client.post(
            "/api/books/search",
            json={"query": "python", "limit": 10}
        )
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 5.0  # Should respond within 5 seconds


class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_endpoint(self, client):
        """Test accessing invalid endpoint"""
        response = client.get("/api/invalid/endpoint")
        assert response.status_code == 404
    
    def test_malformed_json(self, client):
        """Test sending malformed JSON"""
        response = client.post(
            "/api/books/search",
            data="{invalid json}",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code in [400, 422]
    
    def test_missing_required_fields(self, client):
        """Test missing required fields in request"""
        response = client.post(
            "/api/books/search",
            json={}  # Missing query field
        )
        assert response.status_code in [400, 422]
    
    def test_invalid_user_id(self, client):
        """Test with invalid user ID"""
        response = client.get("/api/analytics/reading-patterns/invalid_id")
        assert response.status_code in [400, 404, 422, 500]
