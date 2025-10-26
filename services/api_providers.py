"""
API Provider implementations using Repository pattern
Supports multiple book data sources with fallback mechanisms
"""

import requests
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from tenacity import retry, stop_after_attempt, wait_exponential

from models.book import Book
import config

logger = logging.getLogger(__name__)


class BookAPIProvider(ABC):
    """Abstract base class for book API providers"""
    
    def __init__(self):
        self.session = requests.Session()
        self.name = self.__class__.__name__
    
    @abstractmethod
    def search_books(self, query: str, filters: Optional[Dict] = None, limit: int = 20) -> List[Book]:
        """Search for books"""
        pass
    
    @abstractmethod
    def get_book_details(self, book_id: str) -> Optional[Book]:
        """Get detailed book information"""
        pass
    
    @retry(stop=stop_after_attempt(config.MAX_RETRIES), 
           wait=wait_exponential(multiplier=1, min=4, max=10))
    def _make_request(self, url: str, params: Optional[Dict] = None) -> Dict:
        """Make HTTP request with retry logic"""
        try:
            logger.debug(f"[{self.name}] Request to {url}")
            response = self.session.get(url, params=params, timeout=config.API_TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"[{self.name}] Request failed: {e}")
            raise


class OpenLibraryProvider(BookAPIProvider):
    """OpenLibrary API provider"""
    
    API_URL = "https://openlibrary.org/search.json"
    WORK_URL = "https://openlibrary.org/works/{}.json"
    COVER_URL = "https://covers.openlibrary.org/b/id/{}-L.jpg"
    
    def search_books(self, query: str, filters: Optional[Dict] = None, limit: int = 20) -> List[Book]:
        """Search books using OpenLibrary API"""
        params = {
            "q": query,
            "limit": limit,
            "fields": "title,author_name,first_publish_year,edition_count,cover_i,subject,ratings_average,key,isbn,publisher,language"
        }
        
        if filters:
            if 'year_from' in filters:
                params['first_publish_year__gte'] = filters['year_from']
            if 'year_to' in filters:
                params['first_publish_year__lte'] = filters['year_to']
            if 'min_rating' in filters:
                params['ratings_average__gte'] = filters['min_rating']
        
        try:
            data = self._make_request(self.API_URL, params)
            books = []
            
            for doc in data.get("docs", []):
                if "title" not in doc:
                    continue
                
                work_id = doc.get("key", "").split("/")[-1] if doc.get("key") else None
                cover_id = doc.get("cover_i")
                
                book = Book(
                    title=doc.get("title", "Unknown"),
                    authors=doc.get("author_name", ["Unknown"]),
                    year=doc.get("first_publish_year", 0),
                    edition_count=doc.get("edition_count", 0),
                    cover_id=cover_id,
                    subjects=doc.get("subject", [])[:10],  # Limit subjects
                    work_id=work_id,
                    rating=doc.get("ratings_average"),
                    cover_url=self.COVER_URL.format(cover_id) if cover_id else None,
                    isbn=doc.get("isbn", [None])[0] if doc.get("isbn") else None,
                    publisher=doc.get("publisher", [None])[0] if doc.get("publisher") else None,
                    language=doc.get("language", [None])[0] if doc.get("language") else None
                )
                
                # Get description
                if work_id:
                    book.description = self._get_description(work_id)
                
                # Calculate popularity score
                book.popularity_score = book.calculate_popularity_score()
                
                books.append(book)
            
            logger.info(f"[OpenLibrary] Found {len(books)} books")
            return books
            
        except Exception as e:
            logger.error(f"[OpenLibrary] Search failed: {e}")
            return []
    
    def get_book_details(self, book_id: str) -> Optional[Book]:
        """Get detailed book information"""
        try:
            data = self._make_request(self.WORK_URL.format(book_id))
            # Parse and return book details
            # Implementation similar to search_books
            return None
        except Exception as e:
            logger.error(f"[OpenLibrary] Get details failed: {e}")
            return None
    
    def _get_description(self, work_id: str) -> str:
        """Get book description"""
        try:
            data = self._make_request(self.WORK_URL.format(work_id))
            description = data.get("description", {})
            if isinstance(description, dict):
                return description.get("value", "")
            return description or ""
        except:
            return ""


class GoogleBooksProvider(BookAPIProvider):
    """Google Books API provider"""
    
    API_URL = "https://www.googleapis.com/books/v1/volumes"
    
    def search_books(self, query: str, filters: Optional[Dict] = None, limit: int = 20) -> List[Book]:
        """Search books using Google Books API"""
        params = {
            "q": query,
            "maxResults": min(limit, 40),  # Google Books limit
            "printType": "books"
        }
        
        try:
            data = self._make_request(self.API_URL, params)
            books = []
            
            for item in data.get("items", []):
                vol_info = item.get("volumeInfo", {})
                
                # Extract year from publishedDate
                year = 0
                pub_date = vol_info.get("publishedDate", "")
                if pub_date:
                    try:
                        year = int(pub_date.split("-")[0])
                    except:
                        pass
                
                # Get cover URL
                cover_url = None
                if "imageLinks" in vol_info:
                    cover_url = vol_info["imageLinks"].get("thumbnail") or vol_info["imageLinks"].get("smallThumbnail")
                
                book = Book(
                    title=vol_info.get("title", "Unknown"),
                    authors=vol_info.get("authors", ["Unknown"]),
                    year=year,
                    edition_count=1,  # Google doesn't provide this
                    subjects=vol_info.get("categories", []),
                    description=vol_info.get("description", ""),
                    rating=vol_info.get("averageRating"),
                    cover_url=cover_url,
                    isbn=self._extract_isbn(vol_info.get("industryIdentifiers", [])),
                    publisher=vol_info.get("publisher"),
                    language=vol_info.get("language"),
                    page_count=vol_info.get("pageCount"),
                    work_id=item.get("id")
                )
                
                book.popularity_score = book.calculate_popularity_score()
                books.append(book)
            
            logger.info(f"[GoogleBooks] Found {len(books)} books")
            return books
            
        except Exception as e:
            logger.error(f"[GoogleBooks] Search failed: {e}")
            return []
    
    def get_book_details(self, book_id: str) -> Optional[Book]:
        """Get detailed book information"""
        try:
            url = f"{self.API_URL}/{book_id}"
            data = self._make_request(url)
            # Parse and return book details
            return None
        except Exception as e:
            logger.error(f"[GoogleBooks] Get details failed: {e}")
            return None
    
    def _extract_isbn(self, identifiers: List[Dict]) -> Optional[str]:
        """Extract ISBN from identifiers"""
        for identifier in identifiers:
            if identifier.get("type") in ["ISBN_13", "ISBN_10"]:
                return identifier.get("identifier")
        return None


class APIProviderFactory:
    """Factory for creating and managing API providers with fallback"""
    
    def __init__(self):
        self.providers = [
            OpenLibraryProvider(),
            GoogleBooksProvider()
        ]
        self.primary_provider = self.providers[0]
        logger.info(f"Initialized {len(self.providers)} API providers")
    
    def search_books(self, query: str, filters: Optional[Dict] = None, limit: int = 20) -> List[Book]:
        """Search books with automatic fallback"""
        for provider in self.providers:
            try:
                books = provider.search_books(query, filters, limit)
                if books:
                    logger.info(f"Successfully retrieved books from {provider.name}")
                    return books
            except Exception as e:
                logger.warning(f"{provider.name} failed, trying next provider: {e}")
                continue
        
        logger.error("All API providers failed")
        return []
    
    def get_book_details(self, book_id: str, provider_name: Optional[str] = None) -> Optional[Book]:
        """Get book details from specific or any provider"""
        providers = self.providers
        
        if provider_name:
            providers = [p for p in self.providers if p.name == provider_name]
        
        for provider in providers:
            try:
                book = provider.get_book_details(book_id)
                if book:
                    return book
            except Exception as e:
                logger.warning(f"{provider.name} failed: {e}")
                continue
        
        return None
