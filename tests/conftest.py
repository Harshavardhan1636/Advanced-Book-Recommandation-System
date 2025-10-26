"""
Comprehensive Pytest Configuration and Fixtures
Provides reusable test fixtures and configuration for all tests
"""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path
from unittest.mock import Mock, MagicMock, patch
from datetime import datetime, timedelta
import os

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Set test environment variables
os.environ["TESTING"] = "true"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["REDIS_URL"] = "redis://localhost:6379/1"

from api import app


# ============================================================================
# CLIENT FIXTURES
# ============================================================================

@pytest.fixture(scope="session")
def test_app():
    """FastAPI application instance for testing"""
    return app


@pytest.fixture
def client(test_app):
    """FastAPI test client with proper setup and teardown"""
    with TestClient(test_app) as test_client:
        yield test_client


@pytest.fixture
def async_client(test_app):
    """Async test client for async endpoint testing"""
    from httpx import AsyncClient
    return AsyncClient(app=test_app, base_url="http://test")


# ============================================================================
# DATA FIXTURES
# ============================================================================

@pytest.fixture
def sample_book():
    """Sample book data for testing"""
    return {
        "title": "Python Programming: A Comprehensive Guide",
        "authors": ["John Doe", "Jane Smith"],
        "isbn": "9781234567890",
        "isbn13": "9781234567890123",
        "year": 2024,
        "rating": 4.5,
        "description": "A comprehensive guide to Python programming covering basics to advanced topics.",
        "publisher": "Tech Books Publishing",
        "language": "en",
        "pages": 450,
        "genres": ["Programming", "Computer Science", "Technology"]
    }


@pytest.fixture
def sample_books():
    """Multiple sample books for testing"""
    return [
        {
            "title": "Python Programming",
            "authors": ["John Doe"],
            "isbn": "1234567890",
            "year": 2024,
            "rating": 4.5
        },
        {
            "title": "Data Science Handbook",
            "authors": ["Jane Smith"],
            "isbn": "0987654321",
            "year": 2023,
            "rating": 4.7
        },
        {
            "title": "Machine Learning Basics",
            "authors": ["Bob Johnson"],
            "isbn": "1122334455",
            "year": 2024,
            "rating": 4.3
        }
    ]


@pytest.fixture
def sample_user():
    """Sample user data for testing"""
    return {
        "user_id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User",
        "created_at": datetime.now().isoformat(),
        "subscription_tier": "free",
        "preferences": {
            "favorite_genres": ["Science Fiction", "Fantasy"],
            "reading_goal": 50
        }
    }


@pytest.fixture
def sample_users():
    """Multiple sample users for testing"""
    return [
        {
            "user_id": 1,
            "username": "user1",
            "email": "user1@example.com"
        },
        {
            "user_id": 2,
            "username": "user2",
            "email": "user2@example.com"
        },
        {
            "user_id": 3,
            "username": "user3",
            "email": "user3@example.com"
        }
    ]


@pytest.fixture
def sample_reading_history():
    """Sample reading history for testing"""
    return [
        {
            "book_id": "OL123W",
            "title": "Book 1",
            "read_date": (datetime.now() - timedelta(days=30)).isoformat(),
            "rating": 4.5
        },
        {
            "book_id": "OL456W",
            "title": "Book 2",
            "read_date": (datetime.now() - timedelta(days=15)).isoformat(),
            "rating": 4.0
        },
        {
            "book_id": "OL789W",
            "title": "Book 3",
            "read_date": datetime.now().isoformat(),
            "rating": 5.0
        }
    ]


@pytest.fixture
def sample_achievement():
    """Sample achievement data for testing"""
    return {
        "id": "first_book",
        "name": "First Steps",
        "description": "Read your first book",
        "icon": "📚",
        "points": 10,
        "requirement": {"books_read": 1}
    }


@pytest.fixture
def sample_subscription():
    """Sample subscription data for testing"""
    return {
        "user_id": 1,
        "tier": "premium",
        "status": "active",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=30)).isoformat(),
        "payment_method": "stripe"
    }


# ============================================================================
# MOCK FIXTURES
# ============================================================================

@pytest.fixture
def mock_gemini_response():
    """Mock Gemini AI response"""
    return {
        "summary": "This is a comprehensive AI-generated summary of the book.",
        "key_points": [
            "Main theme 1",
            "Main theme 2",
            "Main theme 3"
        ],
        "recommendation": "Highly recommended for readers interested in this topic."
    }


@pytest.fixture
def mock_gemini_service():
    """Mock Gemini service for testing"""
    with patch('services.gemini_service.gemini_service') as mock:
        mock.generate_summary.return_value = {
            "summary": "Mock summary",
            "key_points": ["Point 1", "Point 2"]
        }
        mock.answer_question.return_value = "Mock answer"
        yield mock


@pytest.fixture
def mock_redis():
    """Mock Redis client for testing"""
    with patch('redis.Redis') as mock:
        mock_instance = MagicMock()
        mock_instance.get.return_value = None
        mock_instance.set.return_value = True
        mock.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def mock_database():
    """Mock database session for testing"""
    with patch('database.get_db') as mock:
        mock_session = MagicMock()
        mock.return_value = mock_session
        yield mock_session


@pytest.fixture
def mock_elasticsearch():
    """Mock Elasticsearch client for testing"""
    with patch('elasticsearch.Elasticsearch') as mock:
        mock_instance = MagicMock()
        mock_instance.search.return_value = {
            "hits": {
                "hits": []
            }
        }
        mock.return_value = mock_instance
        yield mock_instance


# ============================================================================
# AUTHENTICATION FIXTURES
# ============================================================================

@pytest.fixture
def auth_headers():
    """Authentication headers for testing"""
    return {
        "Authorization": "Bearer test_token_12345"
    }


@pytest.fixture
def admin_user():
    """Admin user for testing"""
    return {
        "user_id": 999,
        "username": "admin",
        "email": "admin@example.com",
        "role": "admin",
        "permissions": ["read", "write", "delete", "admin"]
    }


# ============================================================================
# CONFIGURATION FIXTURES
# ============================================================================

@pytest.fixture
def test_config():
    """Test configuration"""
    return {
        "API_TIMEOUT": 5,
        "DEFAULT_LIMIT": 10,
        "CACHE_TIMEOUT_HOURS": 1,
        "TESTING": True
    }


@pytest.fixture(autouse=True)
def reset_singletons():
    """Reset singleton instances between tests"""
    # Reset any singleton instances here if needed
    yield
    # Cleanup after test


# ============================================================================
# PYTEST CONFIGURATION
# ============================================================================

def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
    config.addinivalue_line(
        "markers", "api: marks tests as API tests"
    )
    config.addinivalue_line(
        "markers", "service: marks tests as service layer tests"
    )


def pytest_collection_modifyitems(config, items):
    """Modify test collection"""
    for item in items:
        # Add markers based on test location
        if "test_api" in str(item.fspath):
            item.add_marker(pytest.mark.api)
        elif "test_services" in str(item.fspath):
            item.add_marker(pytest.mark.service)
        
        # Mark slow tests
        if "slow" in item.keywords or "performance" in str(item.name).lower():
            item.add_marker(pytest.mark.slow)
