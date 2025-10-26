"""
Application Startup Script
Checks dependencies and starts the FastAPI server
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'requests',
        'rich',
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - MISSING")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("📦 Install with: pip install -r requirements.txt")
        return False
    
    print("✅ All core dependencies installed!\n")
    return True


def check_environment():
    """Check environment configuration"""
    print("🔍 Checking environment...")
    
    # Check for .env file
    env_file = Path(__file__).parent / '.env'
    if not env_file.exists():
        print("  ⚠️  .env file not found (optional)")
        print("  💡 Copy .env.example to .env for custom configuration")
    else:
        print("  ✅ .env file found")
    
    # Check critical directories
    dirs_to_check = ['models', 'services', 'database', 'ui', 'utils']
    for dir_name in dirs_to_check:
        dir_path = Path(__file__).parent / dir_name
        if dir_path.exists():
            print(f"  ✅ {dir_name}/ directory exists")
        else:
            print(f"  ❌ {dir_name}/ directory missing")
    
    print()
    return True


def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Book Recommendation System API...\n")
    print("=" * 60)
    print("📚 Book Recommendation System v2.0")
    print("=" * 60)
    print()
    print("🌐 API Server: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/api/docs")
    print("🔍 ReDoc: http://localhost:8000/api/redoc")
    print("🎮 GraphQL: http://localhost:8000/api/graphql")
    print()
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    print()
    
    try:
        import uvicorn
        uvicorn.run(
            "api:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        print("\n💡 Troubleshooting:")
        print("  1. Check if port 8000 is already in use")
        print("  2. Verify all dependencies are installed")
        print("  3. Check logs for detailed error messages")
        sys.exit(1)


def main():
    """Main startup function"""
    print("\n" + "=" * 60)
    print("📚 BOOK RECOMMENDATION SYSTEM - STARTUP")
    print("=" * 60 + "\n")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check environment
    check_environment()
    
    # Start server
    start_server()


if __name__ == "__main__":
    main()
