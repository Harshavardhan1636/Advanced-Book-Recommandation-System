"""
Configuration management for Book Recommendation System
"""
import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).parent

# API Configuration
API_URL = "https://openlibrary.org/search.json"
WORK_URL = "https://openlibrary.org/works/{}.json"
COVER_URL = "https://covers.openlibrary.org/b/id/{}-L.jpg"
API_TIMEOUT = int(os.getenv("API_TIMEOUT", "10"))
DEFAULT_LIMIT = int(os.getenv("DEFAULT_LIMIT", "20"))
CACHE_TIMEOUT_HOURS = int(os.getenv("CACHE_TIMEOUT_HOURS", "24"))
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))

# Display Settings
RESULTS_PER_PAGE = int(os.getenv("RESULTS_PER_PAGE", "20"))
DEFAULT_SORT = os.getenv("DEFAULT_SORT", "popularity")
TABLE_MAX_WIDTH = int(os.getenv("TABLE_MAX_WIDTH", "120"))

# File Paths
DATA_DIR = BASE_DIR / "data"
EXPORT_DIR = BASE_DIR / "exports"
LOG_DIR = BASE_DIR / "logs"

FAVORITES_FILE = BASE_DIR / os.getenv("FAVORITES_FILE", "data/favorites.json")
LOG_FILE = BASE_DIR / os.getenv("LOG_FILE", "logs/app.log")

# Create directories if they don't exist
DATA_DIR.mkdir(exist_ok=True)
EXPORT_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = os.getenv(
    "LOG_FORMAT",
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Feature Flags
ENABLE_COVER_IMAGES = os.getenv("ENABLE_COVER_IMAGES", "true").lower() == "true"
ENABLE_RECOMMENDATIONS = os.getenv("ENABLE_RECOMMENDATIONS", "true").lower() == "true"
ENABLE_EXPORT = os.getenv("ENABLE_EXPORT", "true").lower() == "true"
AUTO_OPEN_BROWSER = os.getenv("AUTO_OPEN_BROWSER", "true").lower() == "true"


def get_config_value(key: str, default: Optional[str] = None) -> Optional[str]:
    """Get configuration value with fallback to default"""
    return os.getenv(key, default)


def validate_config() -> bool:
    """Validate configuration settings"""
    try:
        assert API_TIMEOUT > 0, "API_TIMEOUT must be positive"
        assert DEFAULT_LIMIT > 0, "DEFAULT_LIMIT must be positive"
        assert CACHE_TIMEOUT_HOURS > 0, "CACHE_TIMEOUT_HOURS must be positive"
        assert DEFAULT_SORT in ["popularity", "year", "rating"], "Invalid DEFAULT_SORT"
        return True
    except AssertionError as e:
        print(f"Configuration validation error: {e}")
        return False


# Validate on import
if not validate_config():
    print("Warning: Configuration validation failed. Using defaults.")
