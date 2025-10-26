"""
Input validation utilities
"""

from typing import Optional
from datetime import datetime
from rich.console import Console

console = Console()


def validate_year_input(year_str: str) -> Optional[int]:
    """Validate and convert year input"""
    if not year_str:
        return None
    try:
        year = int(year_str)
        if 1000 <= year <= datetime.now().year + 1:
            return year
        console.print("[red]Invalid year range[/red]")
        return None
    except ValueError:
        console.print("[red]Invalid year format[/red]")
        return None


def validate_rating_input(rating_str: str) -> Optional[float]:
    """Validate and convert rating input"""
    if not rating_str:
        return None
    try:
        rating = float(rating_str)
        if 0 <= rating <= 5:
            return rating
        console.print("[red]Rating must be between 0 and 5[/red]")
        return None
    except ValueError:
        console.print("[red]Invalid rating format[/red]")
        return None
