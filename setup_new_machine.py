"""
Setup Script for New Machine
Automatically sets up the Book Recommendation System on any machine
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")

def run_command(command, description):
    """Run a command and return success status"""
    print(f"⏳ {description}...")
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"✅ {description} - Success!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - Failed!")
        print(f"   Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is 3.8+"""
    print_header("CHECKING PYTHON VERSION")
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major == 3 and version.minor >= 8:
        print("✅ Python version is compatible!")
        return True
    else:
        print("❌ Python 3.8+ required!")
        return False

def install_dependencies():
    """Install required packages"""
    print_header("INSTALLING DEPENDENCIES")
    
    requirements_file = Path(__file__).parent / 'requirements.txt'
    
    if not requirements_file.exists():
        print("❌ requirements.txt not found!")
        return False
    
    return run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installing packages from requirements.txt"
    )

def create_env_file():
    """Create .env file from example"""
    print_header("CREATING .ENV FILE")
    
    env_path = Path(__file__).parent / '.env'
    env_example_path = Path(__file__).parent / '.env.example'
    
    if env_path.exists():
        print("⚠️  .env file already exists!")
        overwrite = input("Do you want to overwrite it? (y/n): ").strip().lower()
        if overwrite != 'y':
            print("✅ Keeping existing .env file")
            return True
    
    if env_example_path.exists():
        try:
            with open(env_example_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ .env file created from .env.example")
            print("\n⚠️  IMPORTANT: Edit .env file and add your API keys!")
            print("   See FREE_API_KEYS_GUIDE.md for instructions")
            return True
        except Exception as e:
            print(f"❌ Error creating .env file: {e}")
            return False
    else:
        print("❌ .env.example not found!")
        return False

def create_directories():
    """Create necessary directories"""
    print_header("CREATING DIRECTORIES")
    
    base_path = Path(__file__).parent
    directories = ['logs', 'data', 'exports']
    
    for dir_name in directories:
        dir_path = base_path / dir_name
        try:
            dir_path.mkdir(exist_ok=True)
            print(f"✅ Created/verified: {dir_name}/")
        except Exception as e:
            print(f"❌ Error creating {dir_name}: {e}")
            return False
    
    return True

def test_imports():
    """Test if all imports work"""
    print_header("TESTING IMPORTS")
    
    try:
        print("⏳ Testing API import...")
        import api
        print("✅ API imports successfully!")
        
        print(f"✅ Found {len(api.app.routes)} routes")
        return True
    except Exception as e:
        print(f"❌ Import test failed: {e}")
        return False

def main():
    """Main setup function"""
    print_header("📚 BOOK RECOMMENDATION SYSTEM - SETUP")
    print("This script will set up the application on your machine")
    print()
    
    input("Press ENTER to start setup...")
    
    # Step 1: Check Python version
    if not check_python_version():
        print("\n❌ Setup failed: Python version incompatible")
        sys.exit(1)
    
    # Step 2: Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed: Could not install dependencies")
        sys.exit(1)
    
    # Step 3: Create directories
    if not create_directories():
        print("\n❌ Setup failed: Could not create directories")
        sys.exit(1)
    
    # Step 4: Create .env file
    if not create_env_file():
        print("\n❌ Setup failed: Could not create .env file")
        sys.exit(1)
    
    # Step 5: Test imports
    if not test_imports():
        print("\n⚠️  Warning: Import test failed")
        print("   This might be due to missing API keys in .env")
    
    # Success!
    print_header("✅ SETUP COMPLETE!")
    
    print("🎉 Book Recommendation System is ready!")
    print()
    print("=" * 70)
    print("  NEXT STEPS")
    print("=" * 70)
    print()
    print("1. Edit .env file and add your FREE API keys")
    print("   📖 See: FREE_API_KEYS_GUIDE.md")
    print()
    print("2. Start the server:")
    print("   python start.py")
    print()
    print("3. Visit API documentation:")
    print("   http://localhost:8000/api/docs")
    print()
    print("4. Read the documentation:")
    print("   📖 README.md - Main documentation")
    print("   📖 QUICKSTART.md - Quick start guide")
    print("   📖 FREE_API_KEYS_GUIDE.md - Get FREE API keys")
    print()
    print("=" * 70)
    print()
    print("💡 All API keys are 100% FREE for students!")
    print("   Total cost: $0.00")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏸️  Setup cancelled")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Setup error: {e}")
        sys.exit(1)
