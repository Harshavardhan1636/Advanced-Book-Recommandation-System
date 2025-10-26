# 🚀 Quick Start Guide

Get up and running with the Book Recommendation System in 5 minutes!

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Internet connection

## Installation Steps

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- requests (API calls)
- rich (beautiful CLI)
- Pillow (image handling)
- tenacity (retry logic)
- python-dotenv (configuration)

### 2. Configure (Optional)

Create a `.env` file from the example:

```bash
copy .env.example .env
```

Edit `.env` to customize settings (or use defaults):
```env
API_TIMEOUT=10
DEFAULT_LIMIT=20
LOG_LEVEL=INFO
```

### 3. Run the Application

```bash
python Adv_Bookrecommendation.py
```

## First Steps

### Your First Search

1. **Select option 1** (Simple Search)
2. **Enter a query**: Try "Harry Potter" or "science fiction"
3. **Choose sorting**: Press Enter for default (popularity)
4. **Browse results**: See a beautiful table of books

### View Book Details

1. **Enter a book number** from the results
2. **See detailed information**: Rating, description, subjects
3. **View cover image**: Opens in your browser automatically
4. **Access download links**: Multiple sources provided
5. **Add to favorites**: Confirm when prompted

### Try Advanced Search

1. **Select option 2** (Advanced Search)
2. **Enter query**: "artificial intelligence"
3. **Set filters**:
   - From year: 2020
   - To year: 2024
   - Min rating: 4.0
4. **View filtered results**

### Manage Favorites

1. **Select option 3** (View Favorites)
2. **See your saved books** with notes
3. **Remove favorites** if needed

### Compare Books

1. **After a search**, type 'c' or select option 4
2. **Enter book numbers**: "1 3 5" (space-separated)
3. **View side-by-side comparison**

### Export Results

1. **After a search**, select option 5
2. **Choose format**: CSV or JSON
3. **Find file** in `exports/` directory

## Tips & Tricks

### Search Tips
- **Be specific**: "Python programming beginners" vs "Python"
- **Use author names**: "books by Isaac Asimov"
- **Try subjects**: "machine learning", "fantasy novels"
- **Use filters**: Narrow by year and rating

### Navigation
- **Press Enter**: Go back to main menu
- **Type 'r'**: Get recommendations for a book
- **Type 'c'**: Compare multiple books
- **Use numbers**: Quick book selection

### Keyboard Shortcuts
- **Enter**: Skip/Continue
- **Ctrl+C**: Exit application
- **Arrow keys**: Navigate history in prompts

## Common Use Cases

### Finding New Books in a Genre
```
1. Simple Search → "cyberpunk fiction"
2. Sort by rating
3. View top book details
4. Press 'r' for similar recommendations
5. Add favorites to your list
```

### Research Mode
```
1. Advanced Search → "quantum computing"
2. Filter: 2018-2024, rating 4+
3. Export results to CSV
4. Compare top 3 books
5. Save best ones to favorites
```

### Building a Reading List
```
1. Search for books
2. Add interesting ones to favorites with notes
3. View favorites anytime from main menu
4. Export favorites for sharing
```

## Troubleshooting

### No Results Found
- ✅ Check your internet connection
- ✅ Try different search terms
- ✅ Remove filters if using advanced search
- ✅ Check logs in `logs/app.log`

### API Timeout
- ✅ Increase `API_TIMEOUT` in `.env`
- ✅ Check your network speed
- ✅ Try again later

### Module Not Found
- ✅ Run `pip install -r requirements.txt`
- ✅ Activate virtual environment if using one
- ✅ Check Python version (3.8+)

### Cover Images Not Loading
- ✅ Some books don't have covers
- ✅ Check `ENABLE_COVER_IMAGES` in `.env`
- ✅ Verify browser is set as default

## Configuration Options

### .env File Settings

```env
# API Settings
API_TIMEOUT=10              # Request timeout in seconds
DEFAULT_LIMIT=20            # Results per search
CACHE_TIMEOUT_HOURS=24      # Cache duration
MAX_RETRIES=3               # API retry attempts

# Display
RESULTS_PER_PAGE=20         # Table rows
DEFAULT_SORT=popularity     # Default sort order
TABLE_MAX_WIDTH=120         # Table width

# Features
ENABLE_COVER_IMAGES=true    # Show cover images
ENABLE_RECOMMENDATIONS=true # Enable recommendations
ENABLE_EXPORT=true          # Enable export feature
AUTO_OPEN_BROWSER=true      # Auto-open links

# Logging
LOG_LEVEL=INFO              # DEBUG, INFO, WARNING, ERROR
LOG_FILE=logs/app.log       # Log file path
```

## Directory Structure

```
Book Recommendation System/
├── Adv_Bookrecommendation.py  # Main application
├── config.py                   # Configuration
├── requirements.txt            # Dependencies
├── .env                        # Your settings (create this)
├── .env.example               # Settings template
├── README.md                  # Full documentation
├── QUICKSTART.md              # This file
├── CHANGELOG.md               # Version history
├── data/
│   └── favorites.json         # Your favorites (auto-created)
├── exports/
│   └── *.csv, *.json         # Exported files (auto-created)
└── logs/
    └── app.log               # Application logs (auto-created)
```

## Next Steps

1. ✅ **Explore the features**: Try all menu options
2. ✅ **Build your library**: Add books to favorites
3. ✅ **Customize settings**: Edit `.env` file
4. ✅ **Read the full docs**: Check README.md
5. ✅ **Share feedback**: Report issues or suggestions

## Quick Reference

### Menu Options
1. 🔍 Simple Search - Quick book search
2. 🔎 Advanced Search - Search with filters
3. ⭐ View Favorites - Your saved books
4. 📊 Compare Books - Side-by-side comparison
5. 💾 Export Results - Save to file
6. ⚙️ Settings - View configuration
7. 🚪 Quit - Exit application

### Commands (in results view)
- **Number (1-20)**: View book details
- **'r'**: Get recommendations
- **'c'**: Compare books
- **Enter**: Back to menu

### File Locations
- **Favorites**: `data/favorites.json`
- **Exports**: `exports/book_results_*.csv|json`
- **Logs**: `logs/app.log`
- **Config**: `.env`

## Support

Need help? Check these resources:

1. **README.md**: Comprehensive documentation
2. **CHANGELOG.md**: Recent changes and features
3. **logs/app.log**: Detailed error logs
4. **GitHub Issues**: Report bugs or request features

---

**Happy Reading! 📚✨**

*For more details, see the full [README.md](README.md)*
