"""
Display formatting utilities
"""

from typing import List
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

from models.book import Book, BookRecommendation

console = Console()


def format_book_display(books: List[Book], sort_by: str = "popularity") -> Table:
    """Format books for display in a table"""
    if sort_by == "year":
        books.sort(key=lambda x: x.year if x.year else 0, reverse=True)
    elif sort_by == "rating":
        books.sort(key=lambda x: x.rating if x.rating else 0, reverse=True)
    else:  # popularity (edition_count)
        books.sort(key=lambda x: x.edition_count, reverse=True)

    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("#", justify="right", style="cyan", no_wrap=True)
    table.add_column("Title", width=40)
    table.add_column("Authors", width=30)
    table.add_column("Year", justify="right")
    table.add_column("Editions", justify="right")
    table.add_column("Rating", justify="right")

    for i, book in enumerate(books, 1):
        table.add_row(
            str(i),
            book.title,
            ", ".join(book.authors[:2]),
            str(book.year) if book.year else "Unknown",
            str(book.edition_count),
            f"{book.rating:.1f}" if book.rating else "N/A"
        )

    return table


def format_recommendation_display(recommendations: List[BookRecommendation]) -> Table:
    """Format recommendations for display"""
    table = Table(show_header=True, header_style="bold magenta", title="🎯 Personalized Recommendations")
    table.add_column("#", justify="right", style="cyan", no_wrap=True)
    table.add_column("Title", width=30)
    table.add_column("Authors", width=25)
    table.add_column("Score", justify="right", style="green")
    table.add_column("Why?", width=40)

    for i, rec in enumerate(recommendations, 1):
        table.add_row(
            str(i),
            rec.book.title,
            ", ".join(rec.book.authors[:2]),
            f"{rec.score:.1%}",
            " | ".join(rec.reasons[:2])
        )

    return table
