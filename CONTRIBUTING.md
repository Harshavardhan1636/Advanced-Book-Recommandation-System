# Contributing to BookHub

First off, thank you for considering contributing to BookHub! It's people like you that make BookHub such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the Python and JavaScript styleguides
* Include appropriate test cases
* End all files with a newline
* Avoid platform-dependent code

## Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- PostgreSQL (optional, SQLite for development)
- Redis (optional)

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/bookhub.git
   cd bookhub
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

3. **Set up frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   # Edit the .env files with your settings
   ```

5. **Run backend**
   ```bash
   python api.py
   ```

6. **Run frontend (in another terminal)**
   ```bash
   cd frontend
   npm run dev
   ```

## Styleguides

### Python Styleguide

* Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
* Use type hints where applicable
* Write docstrings for all functions and classes
* Maximum line length: 100 characters
* Use `black` for formatting

```python
# Example
def get_book_recommendations(user_id: int, limit: int = 10) -> List[Book]:
    """
    Get personalized book recommendations for a user.
    
    Args:
        user_id: The ID of the user
        limit: Maximum number of recommendations to return
        
    Returns:
        A list of recommended Book objects
    """
    pass
```

### JavaScript/TypeScript Styleguide

* Use TypeScript for all new code
* Use `const` or `let`, avoid `var`
* Use 2 spaces for indentation
* Use semicolons
* Use descriptive variable names

```typescript
// Example
interface Book {
  id: string;
  title: string;
  author: string;
}

const getBooks = async (query: string): Promise<Book[]> => {
  const response = await fetch(`/api/books/search?query=${query}`);
  return response.json();
};
```

## Testing

### Backend Tests
```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov

# Run specific test
pytest tests/test_api.py::test_search_books -v
```

### Frontend Tests
```bash
cd frontend

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (if available)
npm test
```

## Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

```
Add user authentication with JWT

- Implement JWT token generation
- Add password hashing with bcrypt
- Create login endpoint
- Add token validation middleware

Fixes #123
```

## Documentation

* Keep README.md up to date
* Update CHANGELOG.md with your changes
* Add docstrings to all new functions
* Update API documentation if endpoints change

## Filing a bug report or enhancement suggestion

* **Use a clear and descriptive title**
* **Include as many details as possible**
* **Describe the exact steps which reproduce the problem**

## Project Structure

```
bookhub/
├── api.py                    # Main FastAPI app
├── models/                   # Data models
├── services/                 # Business logic
├── database/                 # Database config
├── tests/                    # Tests
├── frontend/                 # Next.js app
└── docs/                     # Documentation
```

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed

## Community

* Chat: [GitHub Discussions](https://github.com/yourusername/bookhub/discussions)
* Issues: [GitHub Issues](https://github.com/yourusername/bookhub/issues)

## License

By contributing to BookHub, you agree that your contributions will be licensed under its MIT License.

---

Thank you for contributing to BookHub! 🎉
