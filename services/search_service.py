"""
Elasticsearch Full-Text Search Service
Provides advanced search capabilities
"""

import os
import logging
from typing import List, Dict, Optional
from datetime import datetime

try:
    from elasticsearch import Elasticsearch
    ES_AVAILABLE = True
except ImportError:
    ES_AVAILABLE = False

from models.book import Book

logger = logging.getLogger(__name__)


class SearchService:
    """Elasticsearch service for full-text search"""
    
    def __init__(self, es_url: Optional[str] = None):
        self.es_url = es_url or os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
        self.es_client = None
        self.available = ES_AVAILABLE
        self.index_name = "books"
        
        if self.available:
            try:
                self.es_client = Elasticsearch([self.es_url])
                if self.es_client.ping():
                    logger.info("✅ Elasticsearch connected")
                    self._create_index()
                else:
                    logger.warning("Elasticsearch not reachable")
                    self.available = False
            except Exception as e:
                logger.warning(f"Elasticsearch not available: {e}")
                self.available = False
        else:
            logger.warning("Elasticsearch library not installed")
    
    def _create_index(self):
        """Create Elasticsearch index with mappings"""
        if not self.available:
            return
        
        try:
            if not self.es_client.indices.exists(index=self.index_name):
                mappings = {
                    "mappings": {
                        "properties": {
                            "work_id": {"type": "keyword"},
                            "title": {
                                "type": "text",
                                "analyzer": "english",
                                "fields": {
                                    "keyword": {"type": "keyword"}
                                }
                            },
                            "authors": {
                                "type": "text",
                                "analyzer": "english"
                            },
                            "description": {
                                "type": "text",
                                "analyzer": "english"
                            },
                            "subjects": {
                                "type": "text",
                                "analyzer": "english"
                            },
                            "year": {"type": "integer"},
                            "rating": {"type": "float"},
                            "popularity_score": {"type": "float"},
                            "created_at": {"type": "date"}
                        }
                    }
                }
                
                self.es_client.indices.create(index=self.index_name, body=mappings)
                logger.info(f"Created Elasticsearch index: {self.index_name}")
        except Exception as e:
            logger.error(f"Failed to create index: {e}")
    
    def index_book(self, book: Book) -> bool:
        """
        Index a book in Elasticsearch
        
        Args:
            book: Book object to index
        """
        if not self.available:
            return False
        
        try:
            doc = {
                "work_id": book.work_id,
                "title": book.title,
                "authors": book.authors,
                "description": book.description or "",
                "subjects": book.subjects or [],
                "year": book.year,
                "rating": book.rating,
                "popularity_score": book.popularity_score,
                "created_at": datetime.now().isoformat()
            }
            
            self.es_client.index(
                index=self.index_name,
                id=book.work_id,
                document=doc
            )
            
            logger.debug(f"Indexed book: {book.title}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to index book: {e}")
            return False
    
    def bulk_index_books(self, books: List[Book]) -> int:
        """
        Bulk index multiple books
        
        Args:
            books: List of Book objects
            
        Returns:
            Number of successfully indexed books
        """
        if not self.available:
            return 0
        
        try:
            from elasticsearch.helpers import bulk
            
            actions = [
                {
                    "_index": self.index_name,
                    "_id": book.work_id,
                    "_source": {
                        "work_id": book.work_id,
                        "title": book.title,
                        "authors": book.authors,
                        "description": book.description or "",
                        "subjects": book.subjects or [],
                        "year": book.year,
                        "rating": book.rating,
                        "popularity_score": book.popularity_score,
                        "created_at": datetime.now().isoformat()
                    }
                }
                for book in books
            ]
            
            success, failed = bulk(self.es_client, actions)
            logger.info(f"Bulk indexed {success} books, {failed} failed")
            return success
            
        except Exception as e:
            logger.error(f"Bulk indexing failed: {e}")
            return 0
    
    def search(
        self,
        query: str,
        filters: Optional[Dict] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict]:
        """
        Full-text search with filters
        
        Args:
            query: Search query
            filters: Optional filters (year, rating, etc.)
            limit: Number of results
            offset: Offset for pagination
        """
        if not self.available:
            return []
        
        try:
            # Build search query
            must_clauses = [
                {
                    "multi_match": {
                        "query": query,
                        "fields": ["title^3", "authors^2", "description", "subjects"],
                        "type": "best_fields",
                        "fuzziness": "AUTO"
                    }
                }
            ]
            
            # Add filters
            filter_clauses = []
            if filters:
                if "year_min" in filters:
                    filter_clauses.append({"range": {"year": {"gte": filters["year_min"]}}})
                if "year_max" in filters:
                    filter_clauses.append({"range": {"year": {"lte": filters["year_max"]}}})
                if "rating_min" in filters:
                    filter_clauses.append({"range": {"rating": {"gte": filters["rating_min"]}}})
            
            # Build full query
            search_body = {
                "query": {
                    "bool": {
                        "must": must_clauses,
                        "filter": filter_clauses
                    }
                },
                "from": offset,
                "size": limit,
                "sort": [
                    {"_score": {"order": "desc"}},
                    {"popularity_score": {"order": "desc"}}
                ]
            }
            
            response = self.es_client.search(index=self.index_name, body=search_body)
            
            results = []
            for hit in response['hits']['hits']:
                result = hit['_source']
                result['score'] = hit['_score']
                results.append(result)
            
            logger.info(f"Search '{query}' returned {len(results)} results")
            return results
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []
    
    def suggest(self, query: str, limit: int = 5) -> List[str]:
        """
        Get search suggestions/autocomplete
        
        Args:
            query: Partial search query
            limit: Number of suggestions
        """
        if not self.available:
            return []
        
        try:
            search_body = {
                "suggest": {
                    "title-suggest": {
                        "prefix": query,
                        "completion": {
                            "field": "title.keyword",
                            "size": limit,
                            "skip_duplicates": True
                        }
                    }
                }
            }
            
            response = self.es_client.search(index=self.index_name, body=search_body)
            suggestions = [
                option['text']
                for option in response['suggest']['title-suggest'][0]['options']
            ]
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Suggestions failed: {e}")
            return []
    
    def delete_book(self, work_id: str) -> bool:
        """Delete a book from index"""
        if not self.available:
            return False
        
        try:
            self.es_client.delete(index=self.index_name, id=work_id)
            logger.debug(f"Deleted book: {work_id}")
            return True
        except Exception as e:
            logger.error(f"Delete failed: {e}")
            return False
    
    def clear_index(self) -> bool:
        """Clear all documents from index"""
        if not self.available:
            return False
        
        try:
            self.es_client.delete_by_query(
                index=self.index_name,
                body={"query": {"match_all": {}}}
            )
            logger.info("Cleared Elasticsearch index")
            return True
        except Exception as e:
            logger.error(f"Clear index failed: {e}")
            return False


# Global search service instance
search_service = SearchService()
