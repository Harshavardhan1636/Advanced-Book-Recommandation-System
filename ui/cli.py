"""
Command-line interface for Book Recommendation System
"""

import logging
from typing import Optional, List
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.table import Table

from models.book import Book, BookRecommendation
from models.user import UserProfile, ReadingHistory
from services.api_providers import APIProviderFactory
from services.recommendation_engine import RecommendationEngine
from utils.validators import validate_year_input, validate_rating_input
from utils.formatters import format_book_display, format_recommendation_display
import config

logger = logging.getLogger(__name__)
console = Console()


class CLI:
    """Command-line interface manager"""
    
    def __init__(self):
        self.api_factory = APIProviderFactory()
        self.recommendation_engine = RecommendationEngine(strategy="hybrid")
        self.user_profile = self._load_or_create_user_profile()
        self.last_search_results: List[Book] = []
        logger.info("CLI initialized")
    
    def _load_or_create_user_profile(self) -> UserProfile:
        """Load or create user profile"""
        profile_path = config.DATA_DIR / "user_profile.json"
        profile = UserProfile.load(profile_path)
        
        if not profile:
            profile = UserProfile(user_id="default_user", name="Book Lover")
            profile.save(profile_path)
            logger.info("Created new user profile")
        else:
            logger.info(f"Loaded user profile: {profile.name}")
        
        return profile
    
    def show_welcome(self):
        """Show welcome banner"""
        console.print(Panel.fit(
            "[bold cyan]📚 Advanced Book Recommendation System v2.0[/bold cyan]\n"
            "[yellow]Now with ML-powered recommendations![/yellow]\n"
            "Discover your next great read with AI assistance!",
            border_style="green"
        ))
    
    def show_main_menu(self) -> str:
        """Show main menu and get choice"""
        console.print("\n[bold green]═══ Main Menu ═══[/bold green]")
        console.print("1. 🔍 Simple Search")
        console.print("2. 🔎 Advanced Search")
        console.print("3. 🤖 ML-Powered Recommendations")
        console.print("4. 📊 Trending Books")
        console.print("5. 🎭 Mood-Based Recommendations")
        console.print("6. 👤 My Profile & Reading History")
        console.print("7. ⭐ View Favorites")
        console.print("8. 📈 Compare Books")
        console.print("9. 💾 Export Results")
        console.print("10. ⚙️  Settings")
        console.print("11. 🚪 Quit")
        
        return Prompt.ask(
            "\nEnter your choice",
            choices=["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
            default="1"
        )
    
    def simple_search(self):
        """Handle simple search"""
        query = Prompt.ask("\n🔍 Enter search query")
        if not query.strip():
            console.print("[red]Please enter a valid search query.[/red]")
            return
        
        sort_by = Prompt.ask("Sort by", choices=["popularity", "year", "rating"], default="popularity")
        
        with console.status("[bold green]Searching..."):
            books = self.api_factory.search_books(query, limit=config.DEFAULT_LIMIT)
        
        if books:
            self.last_search_results = books
            table = format_book_display(books, sort_by)
            console.print(table)
            console.print(f"\n[green]Found {len(books)} books[/green]")
        else:
            console.print("[yellow]No books found.[/yellow]")
    
    def advanced_search(self):
        """Handle advanced search"""
        query = Prompt.ask("\n🔎 Enter search query")
        if not query.strip():
            console.print("[red]Please enter a valid search query.[/red]")
            return
        
        year_from_str = Prompt.ask("From year (optional)", default="")
        year_to_str = Prompt.ask("To year (optional)", default="")
        min_rating_str = Prompt.ask("Minimum rating 0-5 (optional)", default="")
        sort_by = Prompt.ask("Sort by", choices=["popularity", "year", "rating"], default="popularity")
        
        filters = {}
        year_from = validate_year_input(year_from_str)
        year_to = validate_year_input(year_to_str)
        min_rating = validate_rating_input(min_rating_str)
        
        if year_from: filters['year_from'] = year_from
        if year_to: filters['year_to'] = year_to
        if min_rating: filters['min_rating'] = min_rating
        
        with console.status("[bold green]Searching..."):
            books = self.api_factory.search_books(query, filters, limit=config.DEFAULT_LIMIT)
        
        if books:
            self.last_search_results = books
            table = format_book_display(books, sort_by)
            console.print(table)
            console.print(f"\n[green]Found {len(books)} books[/green]")
        else:
            console.print("[yellow]No books found.[/yellow]")
    
    def ml_recommendations(self):
        """Handle ML-powered recommendations"""
        if not self.last_search_results:
            console.print("[yellow]Please search for books first.[/yellow]")
            return
        
        console.print("\n[cyan]Select a book to get ML-powered recommendations:[/cyan]")
        book_num = Prompt.ask("Book number", default="1")
        
        try:
            idx = int(book_num) - 1
            if 0 <= idx < len(self.last_search_results):
                target_book = self.last_search_results[idx]
                
                # Get more candidates
                with console.status("[bold green]Generating AI recommendations..."):
                    # Search for similar books
                    query = f"{' '.join(target_book.subjects[:2]) if target_book.subjects else target_book.title}"
                    candidates = self.api_factory.search_books(query, limit=50)
                    
                    # Get recommendations
                    recommendations = self.recommendation_engine.get_recommendations(
                        target_book=target_book,
                        candidates=candidates,
                        user_profile=self.user_profile,
                        top_n=10
                    )
                
                if recommendations:
                    console.print(f"\n[bold]🤖 AI Recommendations based on '{target_book.title}':[/bold]")
                    table = format_recommendation_display(recommendations)
                    console.print(table)
                    
                    # Show detailed reasons
                    if Confirm.ask("\nShow detailed reasons?", default=False):
                        for i, rec in enumerate(recommendations[:5], 1):
                            console.print(f"\n[cyan]{i}. {rec.book.title}[/cyan]")
                            for reason in rec.reasons:
                                console.print(f"   • {reason}")
                else:
                    console.print("[yellow]No recommendations found.[/yellow]")
            else:
                console.print("[red]Invalid book number.[/red]")
        except (ValueError, IndexError):
            console.print("[red]Invalid input.[/red]")
    
    def trending_books(self):
        """Show trending books"""
        time_window = Prompt.ask(
            "\n📊 Select time period",
            choices=["recent", "this_year", "classic"],
            default="recent"
        )
        
        with console.status("[bold green]Finding trending books..."):
            # Get popular books
            query = "bestseller" if time_window == "recent" else "classic literature"
            candidates = self.api_factory.search_books(query, limit=50)
            
            recommendations = self.recommendation_engine.get_trending_recommendations(
                candidates=candidates,
                time_window=time_window,
                top_n=10
            )
        
        if recommendations:
            console.print(f"\n[bold]📈 Trending Books ({time_window}):[/bold]")
            table = format_recommendation_display(recommendations)
            console.print(table)
        else:
            console.print("[yellow]No trending books found.[/yellow]")
    
    def mood_based_recommendations(self):
        """Show mood-based recommendations"""
        mood = Prompt.ask(
            "\n🎭 How are you feeling?",
            choices=["happy", "sad", "adventurous", "thoughtful", "relaxed"],
            default="happy"
        )
        
        with console.status(f"[bold green]Finding books for '{mood}' mood..."):
            # Get diverse books
            query = "fiction"
            candidates = self.api_factory.search_books(query, limit=50)
            
            recommendations = self.recommendation_engine.get_mood_based_recommendations(
                candidates=candidates,
                mood=mood,
                top_n=10
            )
        
        if recommendations:
            console.print(f"\n[bold]🎭 Books for '{mood}' mood:[/bold]")
            table = format_recommendation_display(recommendations)
            console.print(table)
        else:
            console.print("[yellow]No matching books found.[/yellow]")
    
    def show_profile(self):
        """Show user profile and reading history"""
        console.print(f"\n[bold cyan]👤 User Profile: {self.user_profile.name}[/bold cyan]")
        console.print(f"Books read: {self.user_profile.get_read_books_count()}")
        console.print(f"Average rating: {self.user_profile.get_average_rating():.1f}/5.0")
        
        if self.user_profile.favorite_authors:
            console.print(f"\n[yellow]Favorite Authors:[/yellow] {', '.join(self.user_profile.favorite_authors[:5])}")
        
        if self.user_profile.favorite_genres:
            console.print(f"[yellow]Favorite Genres:[/yellow] {', '.join(self.user_profile.favorite_genres[:5])}")
        
        if self.user_profile.reading_history:
            console.print(f"\n[bold]📚 Reading History (last 10):[/bold]")
            table = Table(show_header=True, header_style="bold magenta")
            table.add_column("Title", width=35)
            table.add_column("Authors", width=25)
            table.add_column("Rating", justify="right")
            table.add_column("Status")
            
            for entry in self.user_profile.reading_history[-10:]:
                table.add_row(
                    entry.title,
                    ", ".join(entry.authors[:2]),
                    f"{entry.rating:.1f}" if entry.rating else "N/A",
                    entry.status
                )
            
            console.print(table)
        
        # Option to add book to history
        if self.last_search_results and Confirm.ask("\nAdd a book to your reading history?", default=False):
            book_num = Prompt.ask("Book number")
            try:
                idx = int(book_num) - 1
                if 0 <= idx < len(self.last_search_results):
                    book = self.last_search_results[idx]
                    rating = validate_rating_input(Prompt.ask("Your rating (0-5)", default=""))
                    status = Prompt.ask("Status", choices=["read", "reading", "want_to_read"], default="read")
                    
                    history_entry = ReadingHistory(
                        book_id=book.work_id or book.title,
                        title=book.title,
                        authors=book.authors,
                        rating=rating,
                        read_date=None,
                        status=status,
                        tags=book.subjects[:5] if book.subjects else []
                    )
                    
                    self.user_profile.add_to_history(history_entry)
                    self.user_profile.save(config.DATA_DIR / "user_profile.json")
                    console.print("[green]✓ Added to reading history![/green]")
            except (ValueError, IndexError):
                console.print("[red]Invalid input.[/red]")
    
    def run(self):
        """Main application loop"""
        self.show_welcome()
        
        while True:
            try:
                choice = self.show_main_menu()
                
                if choice == '11':
                    console.print("[cyan]Thanks for using Book Recommendation System! Happy reading! 📚[/cyan]")
                    logger.info("Application closed by user")
                    break
                
                if choice == '1':
                    self.simple_search()
                elif choice == '2':
                    self.advanced_search()
                elif choice == '3':
                    self.ml_recommendations()
                elif choice == '4':
                    self.trending_books()
                elif choice == '5':
                    self.mood_based_recommendations()
                elif choice == '6':
                    self.show_profile()
                elif choice == '7':
                    console.print("[yellow]Favorites feature - use original app[/yellow]")
                elif choice == '8':
                    console.print("[yellow]Compare feature - use original app[/yellow]")
                elif choice == '9':
                    console.print("[yellow]Export feature - use original app[/yellow]")
                elif choice == '10':
                    self._show_settings()
                
            except KeyboardInterrupt:
                console.print("\n[yellow]Interrupted by user[/yellow]")
                break
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                console.print(f"[red]An error occurred: {e}[/red]")
    
    def _show_settings(self):
        """Show settings"""
        console.print("\n[bold cyan]⚙️  Settings[/bold cyan]")
        console.print(f"1. API Timeout: {config.API_TIMEOUT}s")
        console.print(f"2. Results per page: {config.DEFAULT_LIMIT}")
        console.print(f"3. Recommendation Strategy: Hybrid ML")
        console.print(f"4. User Profile: {self.user_profile.name}")
        console.print(f"5. Books in history: {len(self.user_profile.reading_history)}")
        console.print("\n[yellow]To change settings, edit the .env file[/yellow]")
