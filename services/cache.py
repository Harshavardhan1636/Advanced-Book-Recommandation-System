"""
Redis caching service
Multi-layer caching strategy
"""

import json
import hashlib
from typing import Optional, Any
from functools import wraps
import logging

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

logger = logging.getLogger(__name__)


class CacheService:
    """Redis cache service with fallback to in-memory cache"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379/0"):
        self.redis_client = None
        self.memory_cache = {}  # Fallback in-memory cache
        
        if REDIS_AVAILABLE:
            try:
                self.redis_client = redis.from_url(redis_url, decode_responses=True)
                self.redis_client.ping()
                logger.info("✅ Redis cache connected")
            except Exception as e:
                logger.warning(f"Redis not available, using memory cache: {e}")
                self.redis_client = None
        else:
            logger.warning("Redis library not installed, using memory cache")
    
    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        key_data = f"{prefix}:{str(args)}:{str(sorted(kwargs.items()))}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if self.redis_client:
                value = self.redis_client.get(key)
                if value:
                    return json.loads(value)
            else:
                return self.memory_cache.get(key)
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set(self, key: str, value: Any, ttl: int = 3600):
        """Set value in cache with TTL (seconds)"""
        try:
            if self.redis_client:
                self.redis_client.setex(key, ttl, json.dumps(value))
            else:
                self.memory_cache[key] = value
                # Note: Memory cache doesn't support TTL in this simple implementation
        except Exception as e:
            logger.error(f"Cache set error: {e}")
    
    def delete(self, key: str):
        """Delete key from cache"""
        try:
            if self.redis_client:
                self.redis_client.delete(key)
            else:
                self.memory_cache.pop(key, None)
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
    
    def clear(self):
        """Clear all cache"""
        try:
            if self.redis_client:
                self.redis_client.flushdb()
            else:
                self.memory_cache.clear()
            logger.info("Cache cleared")
        except Exception as e:
            logger.error(f"Cache clear error: {e}")
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            if self.redis_client:
                return self.redis_client.exists(key) > 0
            else:
                return key in self.memory_cache
        except Exception as e:
            logger.error(f"Cache exists error: {e}")
            return False


# Global cache instance
cache = CacheService()


def cached(prefix: str, ttl: int = 3600):
    """
    Decorator for caching function results
    
    Usage:
        @cached(prefix="book_search", ttl=1800)
        def search_books(query: str):
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache._generate_key(prefix, *args, **kwargs)
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit: {cache_key}")
                return cached_result
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Store in cache
            cache.set(cache_key, result, ttl)
            logger.debug(f"Cache miss: {cache_key}")
            
            return result
        return wrapper
    return decorator


# Cache key patterns
class CacheKeys:
    """Cache key patterns for different data types"""
    
    BOOK_SEARCH = "book:search:{query}:{filters}"
    BOOK_DETAILS = "book:details:{book_id}"
    USER_PROFILE = "user:profile:{user_id}"
    RECOMMENDATIONS = "recommendations:{book_id}:{user_id}"
    TRENDING = "trending:{time_window}"
    ANALYTICS = "analytics:{user_id}:{type}"
    
    @staticmethod
    def book_search(query: str, filters: str = "") -> str:
        return f"book:search:{query}:{filters}"
    
    @staticmethod
    def book_details(book_id: str) -> str:
        return f"book:details:{book_id}"
    
    @staticmethod
    def user_profile(user_id: int) -> str:
        return f"user:profile:{user_id}"
    
    @staticmethod
    def recommendations(book_id: str, user_id: int) -> str:
        return f"recommendations:{book_id}:{user_id}"
    
    @staticmethod
    def trending(time_window: str) -> str:
        return f"trending:{time_window}"
