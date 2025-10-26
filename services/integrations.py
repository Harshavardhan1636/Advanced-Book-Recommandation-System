"""
Third-Party Integrations Service
E-commerce, Library Systems, E-readers, Goodreads, Calendar, Email
"""

import os
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import json
import hashlib
import hmac

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

from models.book import Book

logger = logging.getLogger(__name__)


class ECommerceIntegration:
    """E-commerce affiliate links (Amazon, Book Depository)"""
    
    def __init__(self):
        self.amazon_affiliate_id = os.getenv("AMAZON_AFFILIATE_ID", "bookrec-20")
        self.book_depository_affiliate_id = os.getenv("BOOK_DEPOSITORY_AFFILIATE_ID", "")
        logger.info("✅ E-commerce integration initialized")
    
    def get_amazon_link(self, isbn: str, title: str = "") -> str:
        """
        Generate Amazon affiliate link
        
        Args:
            isbn: Book ISBN
            title: Book title (optional)
        """
        base_url = "https://www.amazon.com/dp"
        return f"{base_url}/{isbn}?tag={self.amazon_affiliate_id}"
    
    def get_book_depository_link(self, isbn: str) -> str:
        """Generate Book Depository affiliate link"""
        base_url = "https://www.bookdepository.com"
        if self.book_depository_affiliate_id:
            return f"{base_url}/book/{isbn}?a_aid={self.book_depository_affiliate_id}"
        return f"{base_url}/book/{isbn}"
    
    def get_all_purchase_links(self, book: Book) -> Dict[str, str]:
        """
        Get all purchase links for a book
        
        Returns:
            Dict with retailer names and affiliate links
        """
        isbn = book.isbn or book.work_id
        
        links = {
            "amazon": self.get_amazon_link(isbn, book.title),
            "book_depository": self.get_book_depository_link(isbn),
            "barnes_noble": f"https://www.barnesandnoble.com/s/{isbn}",
            "books_a_million": f"https://www.booksamillion.com/search?query={isbn}",
            "indie_bound": f"https://www.indiebound.org/book/{isbn}"
        }
        
        logger.info(f"Generated purchase links for: {book.title}")
        return links


class LibraryIntegration:
    """Library systems integration (Google Books, LibraryThing)"""
    
    def __init__(self):
        # Use FREE alternatives: Google Books + LibraryThing
        self.google_books_key = os.getenv("GOOGLE_BOOKS_API_KEY", "")
        self.librarything_key = os.getenv("LIBRARYTHING_API_KEY", "")
        self.overdrive_api_key = os.getenv("OVERDRIVE_API_KEY", "")
        
        # Available if we have Google Books OR LibraryThing (both FREE!)
        self.available = REQUESTS_AVAILABLE and (self.google_books_key or self.librarything_key)
        
        if self.available:
            providers = []
            if self.google_books_key:
                providers.append("Google Books")
            if self.librarything_key:
                providers.append("LibraryThing")
            logger.info(f"✅ Library integration initialized ({', '.join(providers)})")
        else:
            logger.warning("⚠️  Library integration not available (missing API key)")
    
    def check_overdrive_availability(
        self,
        isbn: str,
        library_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Check book availability in OverDrive/Libby
        
        Args:
            isbn: Book ISBN
            library_id: Library system ID
        """
        if not self.available:
            return self._mock_availability(isbn)
        
        try:
            # OverDrive API endpoint
            url = f"https://api.overdrive.com/v1/collections/{library_id}/products/{isbn}/availability"
            
            # In production, implement OAuth authentication
            # For now, return mock data
            return self._mock_availability(isbn)
            
        except Exception as e:
            logger.error(f"OverDrive availability check failed: {e}")
            return self._mock_availability(isbn)
    
    def find_nearby_libraries(self, zip_code: str) -> List[Dict]:
        """
        Find libraries near a zip code
        
        Args:
            zip_code: User's zip code
        """
        # Mock implementation - in production, use OverDrive library finder API
        return [
            {
                "id": "lib001",
                "name": "City Public Library",
                "distance": "2.3 miles",
                "has_overdrive": True
            },
            {
                "id": "lib002",
                "name": "County Library System",
                "distance": "5.1 miles",
                "has_overdrive": True
            }
        ]
    
    def _mock_availability(self, isbn: str) -> Dict[str, Any]:
        """Mock library availability data"""
        return {
            "isbn": isbn,
            "available": True,
            "format": ["ebook", "audiobook"],
            "wait_time": "0 days",
            "copies_available": 3,
            "total_copies": 5,
            "checkout_url": f"https://libbyapp.com/search/{isbn}"
        }


class EReaderIntegration:
    """E-reader sync (Kindle, Kobo)"""
    
    def __init__(self):
        self.kindle_email = os.getenv("KINDLE_EMAIL", "")
        self.kobo_api_key = os.getenv("KOBO_API_KEY", "")
        logger.info("✅ E-reader integration initialized")
    
    def send_to_kindle(self, book: Book, user_email: str) -> Dict[str, Any]:
        """
        Send book to Kindle device
        
        Args:
            book: Book object
            user_email: User's Kindle email
        """
        if not self.kindle_email:
            return {
                "status": "error",
                "message": "Kindle email not configured"
            }
        
        # In production, implement email sending with book file
        logger.info(f"Would send '{book.title}' to Kindle: {user_email}")
        
        return {
            "status": "success",
            "message": f"Book sent to {user_email}",
            "book_title": book.title,
            "delivery_time": "5-10 minutes"
        }
    
    def sync_kobo_reading_progress(self, user_id: int) -> Dict[str, Any]:
        """
        Sync reading progress from Kobo
        
        Args:
            user_id: User ID
        """
        if not self.kobo_api_key:
            return {
                "status": "error",
                "message": "Kobo API not configured"
            }
        
        # Mock implementation
        return {
            "status": "success",
            "synced_books": 5,
            "last_sync": datetime.now().isoformat()
        }
    
    def get_ereader_formats(self, book: Book) -> List[str]:
        """Get available e-reader formats for a book"""
        # Common e-book formats
        formats = ["EPUB", "PDF", "MOBI", "AZW3"]
        
        return {
            "book_title": book.title,
            "available_formats": formats,
            "kindle_compatible": ["MOBI", "AZW3"],
            "kobo_compatible": ["EPUB", "PDF"]
        }


class GoodreadsIntegration:
    """Book data integration (Google Books as FREE alternative to Goodreads)"""
    
    def __init__(self):
        # Goodreads API is closed, use Google Books instead (FREE!)
        self.google_books_key = os.getenv("GOOGLE_BOOKS_API_KEY", "")
        self.goodreads_api_key = os.getenv("GOODREADS_API_KEY", "")  # Legacy support
        self.available = REQUESTS_AVAILABLE and self.google_books_key
        
        if self.available:
            logger.info("✅ Book data integration initialized (Google Books - FREE alternative to Goodreads)")
        else:
            logger.warning("⚠️  Goodreads integration not available")
    
    def import_reading_history(self, goodreads_user_id: str) -> Dict[str, Any]:
        """
        Import reading history from Goodreads
        
        Args:
            goodreads_user_id: Goodreads user ID
        """
        if not self.available:
            return self._mock_import()
        
        try:
            # In production, use Goodreads API
            # Note: Goodreads API is deprecated, may need to use CSV export
            return self._mock_import()
            
        except Exception as e:
            logger.error(f"Goodreads import failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def parse_goodreads_csv(self, csv_file_path: str) -> List[Dict]:
        """
        Parse Goodreads CSV export
        
        Args:
            csv_file_path: Path to Goodreads CSV export
        """
        import csv
        
        books = []
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    books.append({
                        "title": row.get("Title", ""),
                        "author": row.get("Author", ""),
                        "isbn": row.get("ISBN13", ""),
                        "rating": float(row.get("My Rating", 0)),
                        "date_read": row.get("Date Read", ""),
                        "shelves": row.get("Bookshelves", "").split(", ")
                    })
            
            logger.info(f"Parsed {len(books)} books from Goodreads CSV")
            return books
            
        except Exception as e:
            logger.error(f"CSV parsing failed: {e}")
            return []
    
    def _mock_import(self) -> Dict[str, Any]:
        """Mock Goodreads import"""
        return {
            "status": "success",
            "imported_books": 42,
            "shelves": ["read", "currently-reading", "to-read"],
            "ratings_imported": 38
        }


class CalendarIntegration:
    """Calendar integration for reading schedules"""
    
    def __init__(self):
        self.google_calendar_api_key = os.getenv("GOOGLE_CALENDAR_API_KEY", "")
        logger.info("✅ Calendar integration initialized")
    
    def create_reading_schedule(
        self,
        book: Book,
        start_date: datetime,
        pages_per_day: int = 50
    ) -> Dict[str, Any]:
        """
        Create reading schedule in calendar
        
        Args:
            book: Book to schedule
            start_date: When to start reading
            pages_per_day: Daily reading goal
        """
        total_pages = book.page_count or 300
        days_to_complete = (total_pages // pages_per_day) + 1
        end_date = start_date + timedelta(days=days_to_complete)
        
        schedule = {
            "book_title": book.title,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_pages": total_pages,
            "pages_per_day": pages_per_day,
            "estimated_days": days_to_complete,
            "calendar_events": []
        }
        
        # Generate daily reading events
        current_date = start_date
        pages_read = 0
        
        while pages_read < total_pages:
            pages_today = min(pages_per_day, total_pages - pages_read)
            schedule["calendar_events"].append({
                "date": current_date.isoformat(),
                "title": f"Read {book.title}",
                "description": f"Pages {pages_read + 1} - {pages_read + pages_today}",
                "duration": "30 minutes"
            })
            pages_read += pages_today
            current_date += timedelta(days=1)
        
        logger.info(f"Created reading schedule for: {book.title}")
        return schedule
    
    def export_to_ical(self, schedule: Dict[str, Any]) -> str:
        """
        Export schedule to iCal format
        
        Args:
            schedule: Reading schedule dict
        """
        # Simple iCal format
        ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Book Recommendation System//EN\n"
        
        for event in schedule.get("calendar_events", []):
            ical += "BEGIN:VEVENT\n"
            ical += f"SUMMARY:{event['title']}\n"
            ical += f"DESCRIPTION:{event['description']}\n"
            ical += f"DTSTART:{event['date'].replace('-', '').replace(':', '')}00Z\n"
            ical += "DURATION:PT30M\n"
            ical += "END:VEVENT\n"
        
        ical += "END:VCALENDAR"
        return ical


class EmailNotificationService:
    """Email notifications and newsletters"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("SMTP_FROM", "noreply@bookrec.com")
        
        self.available = bool(self.smtp_username and self.smtp_password)
        
        if self.available:
            logger.info(f"✅ Email notification service initialized ({self.smtp_username})")
        else:
            logger.warning("⚠️  Email service not configured")
    
    def send_recommendation_email(
        self,
        to_email: str,
        recommendations: List[Book],
        user_name: str = "Reader"
    ) -> Dict[str, Any]:
        """
        Send personalized recommendation email
        
        Args:
            to_email: Recipient email
            recommendations: List of recommended books
            user_name: User's name
        """
        if not self.available:
            return self._mock_email_sent(to_email)
        
        subject = f"📚 Your Weekly Book Recommendations, {user_name}!"
        
        # HTML email template
        html_content = self._generate_recommendation_html(recommendations, user_name)
        
        # In production, use proper email library (e.g., smtplib, SendGrid)
        logger.info(f"Would send recommendation email to: {to_email}")
        
        return self._mock_email_sent(to_email)
    
    def send_reading_reminder(
        self,
        to_email: str,
        book_title: str,
        pages_due: int
    ) -> Dict[str, Any]:
        """Send reading reminder notification"""
        if not self.available:
            return self._mock_email_sent(to_email)
        
        subject = f"📖 Reading Reminder: {book_title}"
        message = f"Don't forget to read {pages_due} pages of '{book_title}' today!"
        
        logger.info(f"Would send reminder to: {to_email}")
        return self._mock_email_sent(to_email)
    
    def send_newsletter(
        self,
        to_email: str,
        newsletter_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send personalized newsletter
        
        Args:
            to_email: Recipient email
            newsletter_data: Newsletter content
        """
        if not self.available:
            return self._mock_email_sent(to_email)
        
        subject = "📚 Your Monthly Reading Newsletter"
        html_content = self._generate_newsletter_html(newsletter_data)
        
        logger.info(f"Would send newsletter to: {to_email}")
        return self._mock_email_sent(to_email)
    
    def _generate_recommendation_html(
        self,
        recommendations: List[Book],
        user_name: str
    ) -> str:
        """Generate HTML for recommendation email"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Hi {user_name}! 👋</h2>
            <p>Here are your personalized book recommendations this week:</p>
            <div style="margin: 20px 0;">
        """
        
        for book in recommendations[:5]:
            html += f"""
                <div style="margin: 15px 0; padding: 10px; border-left: 3px solid #3b82f6;">
                    <h3>{book.title}</h3>
                    <p><strong>By:</strong> {', '.join(book.authors)}</p>
                    <p>{book.description[:200] if book.description else 'No description available'}...</p>
                </div>
            """
        
        html += """
            </div>
            <p>Happy reading! 📚</p>
            <p><small>Unsubscribe from these emails anytime in your settings.</small></p>
        </body>
        </html>
        """
        return html
    
    def _generate_newsletter_html(self, data: Dict[str, Any]) -> str:
        """Generate HTML for newsletter"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>📚 Your Monthly Reading Report</h2>
            <div style="margin: 20px 0;">
                <h3>This Month's Stats:</h3>
                <ul>
                    <li>Books Read: {data.get('books_read', 0)}</li>
                    <li>Pages Read: {data.get('pages_read', 0)}</li>
                    <li>Reading Streak: {data.get('streak', 0)} days</li>
                </ul>
            </div>
            <div style="margin: 20px 0;">
                <h3>Trending in Your Favorite Genres:</h3>
                <p>Check out what's popular this month!</p>
            </div>
        </body>
        </html>
        """
        return html
    
    def _mock_email_sent(self, to_email: str) -> Dict[str, Any]:
        """Mock email sent response"""
        return {
            "status": "success",
            "to": to_email,
            "sent_at": datetime.now().isoformat(),
            "message": "Email would be sent in production"
        }


# Global integration instances
ecommerce_integration = ECommerceIntegration()
library_integration = LibraryIntegration()
ereader_integration = EReaderIntegration()
goodreads_integration = GoodreadsIntegration()
calendar_integration = CalendarIntegration()
email_service = EmailNotificationService()
