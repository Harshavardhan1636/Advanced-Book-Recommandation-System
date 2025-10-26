"""
API Management Service
GraphQL, Webhooks, Versioning, Rate Limiting, SDK
"""

import os
import logging
from typing import List, Dict, Optional, Any, Callable
from datetime import datetime, timedelta
from collections import defaultdict
import time
import hashlib
import hmac
import json

try:
    import strawberry
    from strawberry.fastapi import GraphQLRouter
    GRAPHQL_AVAILABLE = True
except ImportError:
    GRAPHQL_AVAILABLE = False

logger = logging.getLogger(__name__)


# ============================================================================
# GRAPHQL SCHEMA
# ============================================================================

if GRAPHQL_AVAILABLE:
    @strawberry.type
    class BookType:
        """GraphQL Book type"""
        work_id: str
        title: str
        authors: List[str]
        description: Optional[str]
        year: Optional[int]
        rating: Optional[float]
        page_count: Optional[int]
        subjects: Optional[List[str]]
        isbn: Optional[str]
        cover_url: Optional[str]
    
    @strawberry.type
    class UserType:
        """GraphQL User type"""
        user_id: int
        username: str
        email: str
        favorite_genres: List[str]
        favorite_authors: List[str]
    
    @strawberry.type
    class RecommendationType:
        """GraphQL Recommendation type"""
        book: BookType
        score: float
        reason: str
    
    @strawberry.type
    class Query:
        """GraphQL Query root"""
        
        @strawberry.field
        def book(self, work_id: str) -> Optional[BookType]:
            """Get a single book by ID"""
            # In production, fetch from database
            return None
        
        @strawberry.field
        def books(
            self,
            query: str,
            limit: int = 10,
            offset: int = 0
        ) -> List[BookType]:
            """Search books"""
            # In production, implement search
            return []
        
        @strawberry.field
        def recommendations(
            self,
            user_id: int,
            limit: int = 10
        ) -> List[RecommendationType]:
            """Get personalized recommendations"""
            # In production, implement recommendations
            return []
        
        @strawberry.field
        def user(self, user_id: int) -> Optional[UserType]:
            """Get user profile"""
            # In production, fetch from database
            return None
    
    @strawberry.type
    class Mutation:
        """GraphQL Mutation root"""
        
        @strawberry.mutation
        def add_to_reading_list(
            self,
            user_id: int,
            book_id: str
        ) -> bool:
            """Add book to reading list"""
            # In production, implement
            return True
        
        @strawberry.mutation
        def rate_book(
            self,
            user_id: int,
            book_id: str,
            rating: float
        ) -> bool:
            """Rate a book"""
            # In production, implement
            return True
    
    # Create GraphQL schema
    graphql_schema = strawberry.Schema(query=Query, mutation=Mutation)
    
    logger.info("✅ GraphQL schema created")
else:
    graphql_schema = None
    logger.warning("⚠️  GraphQL not available (strawberry-graphql not installed)")


# ============================================================================
# WEBHOOKS
# ============================================================================

class WebhookManager:
    """Webhook management for event-driven notifications"""
    
    def __init__(self):
        self.webhooks: Dict[str, List[Dict]] = defaultdict(list)
        self.secret_key = os.getenv("WEBHOOK_SECRET_KEY", "your-secret-key-here")
        logger.info("✅ Webhook manager initialized")
    
    def register_webhook(
        self,
        event_type: str,
        url: str,
        secret: Optional[str] = None
    ) -> str:
        """
        Register a webhook for an event type
        
        Args:
            event_type: Event to listen for (e.g., 'book.recommended', 'user.reading_goal_achieved')
            url: Webhook URL to call
            secret: Optional secret for signature verification
        
        Returns:
            Webhook ID
        """
        webhook_id = hashlib.sha256(f"{url}{time.time()}".encode()).hexdigest()[:16]
        
        webhook = {
            "id": webhook_id,
            "event_type": event_type,
            "url": url,
            "secret": secret or self.secret_key,
            "created_at": datetime.now().isoformat(),
            "active": True
        }
        
        self.webhooks[event_type].append(webhook)
        logger.info(f"Registered webhook {webhook_id} for event: {event_type}")
        
        return webhook_id
    
    def unregister_webhook(self, webhook_id: str) -> bool:
        """Unregister a webhook"""
        for event_type, hooks in self.webhooks.items():
            for hook in hooks:
                if hook["id"] == webhook_id:
                    hook["active"] = False
                    logger.info(f"Unregistered webhook: {webhook_id}")
                    return True
        return False
    
    def trigger_event(self, event_type: str, payload: Dict[str, Any]) -> List[Dict]:
        """
        Trigger webhooks for an event
        
        Args:
            event_type: Event type
            payload: Event data
        
        Returns:
            List of webhook responses
        """
        if event_type not in self.webhooks:
            return []
        
        responses = []
        
        for webhook in self.webhooks[event_type]:
            if not webhook["active"]:
                continue
            
            try:
                # Generate signature
                signature = self._generate_signature(payload, webhook["secret"])
                
                # In production, send HTTP POST request
                logger.info(f"Would trigger webhook {webhook['id']}: {webhook['url']}")
                
                responses.append({
                    "webhook_id": webhook["id"],
                    "status": "success",
                    "triggered_at": datetime.now().isoformat()
                })
                
            except Exception as e:
                logger.error(f"Webhook {webhook['id']} failed: {e}")
                responses.append({
                    "webhook_id": webhook["id"],
                    "status": "error",
                    "error": str(e)
                })
        
        return responses
    
    def _generate_signature(self, payload: Dict, secret: str) -> str:
        """Generate HMAC signature for webhook payload"""
        payload_bytes = json.dumps(payload, sort_keys=True).encode()
        signature = hmac.new(
            secret.encode(),
            payload_bytes,
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def list_webhooks(self, event_type: Optional[str] = None) -> List[Dict]:
        """List registered webhooks"""
        if event_type:
            return self.webhooks.get(event_type, [])
        
        all_webhooks = []
        for hooks in self.webhooks.values():
            all_webhooks.extend(hooks)
        return all_webhooks


# ============================================================================
# API VERSIONING
# ============================================================================

class APIVersionManager:
    """API versioning for backward compatibility"""
    
    def __init__(self):
        self.current_version = "v2"
        self.supported_versions = ["v1", "v2"]
        self.deprecated_versions = []
        logger.info(f"✅ API version manager initialized (current: {self.current_version})")
    
    def get_version_from_header(self, headers: Dict[str, str]) -> str:
        """Extract API version from request headers"""
        version = headers.get("X-API-Version", self.current_version)
        
        if version not in self.supported_versions:
            logger.warning(f"Unsupported API version requested: {version}")
            return self.current_version
        
        if version in self.deprecated_versions:
            logger.warning(f"Deprecated API version used: {version}")
        
        return version
    
    def get_version_from_url(self, path: str) -> str:
        """Extract API version from URL path"""
        # Example: /api/v1/books -> v1
        parts = path.split("/")
        for part in parts:
            if part in self.supported_versions:
                return part
        return self.current_version
    
    def deprecate_version(self, version: str, sunset_date: datetime):
        """Mark a version as deprecated"""
        if version not in self.supported_versions:
            return
        
        self.deprecated_versions.append(version)
        logger.info(f"Version {version} deprecated, sunset date: {sunset_date}")
    
    def is_version_supported(self, version: str) -> bool:
        """Check if version is supported"""
        return version in self.supported_versions


# ============================================================================
# RATE LIMITING
# ============================================================================

class RateLimiter:
    """Rate limiting for fair usage"""
    
    def __init__(self):
        self.requests: Dict[str, List[float]] = defaultdict(list)
        self.limits = {
            "anonymous": {"requests": 100, "window": 3600},  # 100 req/hour
            "authenticated": {"requests": 1000, "window": 3600},  # 1000 req/hour
            "premium": {"requests": 10000, "window": 3600}  # 10000 req/hour
        }
        logger.info("✅ Rate limiter initialized")
    
    def check_rate_limit(
        self,
        identifier: str,
        tier: str = "authenticated"
    ) -> Dict[str, Any]:
        """
        Check if request is within rate limit
        
        Args:
            identifier: User ID, API key, or IP address
            tier: Rate limit tier (anonymous, authenticated, premium)
        
        Returns:
            Dict with allowed status and limit info
        """
        current_time = time.time()
        limit_config = self.limits.get(tier, self.limits["authenticated"])
        
        # Clean old requests outside the window
        window_start = current_time - limit_config["window"]
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > window_start
        ]
        
        # Check limit
        request_count = len(self.requests[identifier])
        allowed = request_count < limit_config["requests"]
        
        if allowed:
            self.requests[identifier].append(current_time)
        
        # Calculate reset time
        if self.requests[identifier]:
            oldest_request = min(self.requests[identifier])
            reset_time = oldest_request + limit_config["window"]
        else:
            reset_time = current_time + limit_config["window"]
        
        return {
            "allowed": allowed,
            "limit": limit_config["requests"],
            "remaining": max(0, limit_config["requests"] - request_count),
            "reset": int(reset_time),
            "retry_after": int(reset_time - current_time) if not allowed else 0
        }
    
    def get_rate_limit_headers(self, identifier: str, tier: str = "authenticated") -> Dict[str, str]:
        """Get rate limit headers for response"""
        limit_info = self.check_rate_limit(identifier, tier)
        
        return {
            "X-RateLimit-Limit": str(limit_info["limit"]),
            "X-RateLimit-Remaining": str(limit_info["remaining"]),
            "X-RateLimit-Reset": str(limit_info["reset"])
        }


# ============================================================================
# SDK CLIENT LIBRARY GENERATOR
# ============================================================================

class SDKGenerator:
    """Generate SDK/client libraries"""
    
    @staticmethod
    def generate_python_client() -> str:
        """Generate Python SDK client code"""
        code = '''"""
Book Recommendation System - Python SDK
Auto-generated client library
"""

import requests
from typing import List, Dict, Optional, Any


class BookRecClient:
    """Python client for Book Recommendation System API"""
    
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })
    
    def search_books(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for books"""
        response = self.session.post(
            f"{self.base_url}/api/books/search",
            json={"query": query, "limit": limit}
        )
        response.raise_for_status()
        return response.json()
    
    def get_recommendations(self, book_id: str, limit: int = 10) -> List[Dict]:
        """Get book recommendations"""
        response = self.session.post(
            f"{self.base_url}/api/recommendations/ml",
            json={"target_book_id": book_id, "limit": limit}
        )
        response.raise_for_status()
        return response.json()
    
    def get_user_profile(self) -> Dict:
        """Get user profile"""
        response = self.session.get(f"{self.base_url}/api/user/profile")
        response.raise_for_status()
        return response.json()
    
    def add_to_reading_history(self, book_id: str, status: str = "read") -> Dict:
        """Add book to reading history"""
        response = self.session.post(
            f"{self.base_url}/api/user/history",
            json={"book_id": book_id, "status": status}
        )
        response.raise_for_status()
        return response.json()


# Example usage:
# client = BookRecClient(api_key="your-api-key")
# books = client.search_books("python programming")
# recommendations = client.get_recommendations(books[0]["work_id"])
'''
        return code
    
    @staticmethod
    def generate_javascript_client() -> str:
        """Generate JavaScript SDK client code"""
        code = '''/**
 * Book Recommendation System - JavaScript SDK
 * Auto-generated client library
 */

class BookRecClient {
    constructor(apiKey, baseUrl = 'http://localhost:8000') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    
    async _request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        
        return response.json();
    }
    
    async searchBooks(query, limit = 10) {
        return this._request('/api/books/search', {
            method: 'POST',
            body: JSON.stringify({ query, limit })
        });
    }
    
    async getRecommendations(bookId, limit = 10) {
        return this._request('/api/recommendations/ml', {
            method: 'POST',
            body: JSON.stringify({ target_book_id: bookId, limit })
        });
    }
    
    async getUserProfile() {
        return this._request('/api/user/profile');
    }
    
    async addToReadingHistory(bookId, status = 'read') {
        return this._request('/api/user/history', {
            method: 'POST',
            body: JSON.stringify({ book_id: bookId, status })
        });
    }
}

// Example usage:
// const client = new BookRecClient('your-api-key');
// const books = await client.searchBooks('python programming');
// const recommendations = await client.getRecommendations(books[0].work_id);

export default BookRecClient;
'''
        return code


# Global instances
webhook_manager = WebhookManager()
version_manager = APIVersionManager()
rate_limiter = RateLimiter()
sdk_generator = SDKGenerator()
