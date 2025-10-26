"""
Setup script for Book Recommendation System
Helps users get started quickly by checking dependencies and configuration
"""

import sys
import subprocess
import os
from pathlib import Path

def print_header(text):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    print_header("Checking Python Version")
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required!")
        print("Please upgrade Python and try again.")
        return False
    
    print("✅ Python version is compatible")
    return True

def check_pip():
    """Check if pip is available"""
    print_header("Checking pip")
    try:
        result = subprocess.run([sys.executable, "-m", "pip", "--version"], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ pip is available: {result.stdout.strip()}")
            return True
    except Exception as e:
        print(f"❌ pip not found: {e}")
    
    print("Please install pip and try again.")
    return False

def install_dependencies():
    """Install required dependencies"""
    print_header("Installing Dependencies")
    
    requirements_file = Path("requirements.txt")
    if not requirements_file.exists():
        print("❌ requirements.txt not found!")
        return False
    
    print("Installing packages from requirements.txt...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ All dependencies installed successfully!")
            return True
        else:
            print(f"❌ Installation failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error during installation: {e}")
        return False

def setup_environment():
    """Setup .env file from template"""
    print_header("Setting up Environment")
    
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("ℹ️  .env file already exists")
        response = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if response != 'y':
            print("Keeping existing .env file")
            return True
    
    if not env_example.exists():
        print("❌ .env.example not found!")
        return False
    
    try:
        # Copy .env.example to .env
        with open(env_example, 'r') as src:
            content = src.read()
        
        with open(env_file, 'w') as dst:
            dst.write(content)
        
        print("✅ .env file created from template")
        print("You can customize settings by editing the .env file")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    print_header("Creating Directories")
    
    directories = ['data', 'exports', 'logs']
    
    for dir_name in directories:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"ℹ️  {dir_name}/ already exists")
        else:
            try:
                dir_path.mkdir(parents=True, exist_ok=True)
                print(f"✅ Created {dir_name}/ directory")
            except Exception as e:
                print(f"❌ Error creating {dir_name}/: {e}")
                return False
    
    return True

def verify_files():
    """Verify all required files exist"""
    print_header("Verifying Project Files")
    
    required_files = [
        'Adv_Bookrecommendation.py',
        'config.py',
        'requirements.txt',
        'README.md',
        '.env.example'
    ]
    
    all_present = True
    for file_name in required_files:
        file_path = Path(file_name)
        if file_path.exists():
            print(f"✅ {file_name}")
        else:
            print(f"❌ {file_name} - MISSING!")
            all_present = False
    
    return all_present

def print_next_steps():
    """Print next steps for the user"""
    print_header("Setup Complete!")
    
    print("🎉 Your Book Recommendation System is ready to use!")
    print("\n📋 Next Steps:\n")
    print("1. (Optional) Customize settings:")
    print("   - Edit the .env file")
    print("   - Adjust API timeout, limits, features, etc.")
    print()
    print("2. Run the application:")
    print("   python Adv_Bookrecommendation.py")
    print()
    print("3. Read the documentation:")
    print("   - QUICKSTART.md - 5-minute getting started guide")
    print("   - README.md - Comprehensive documentation")
    print("   - IMPROVEMENTS_SUMMARY.md - All features explained")
    print()
    print("📚 Happy reading!")
    print()

def main():
    """Main setup function"""
    print("\n" + "="*60)
    print("  📚 Book Recommendation System - Setup")
    print("="*60)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check pip
    if not check_pip():
        sys.exit(1)
    
    # Verify files
    if not verify_files():
        print("\n❌ Some required files are missing!")
        print("Please ensure you have all project files.")
        sys.exit(1)
    
    # Install dependencies
    print("\nDo you want to install dependencies now?")
    response = input("This will run: pip install -r requirements.txt (Y/n): ").strip().lower()
    
    if response != 'n':
        if not install_dependencies():
            print("\n⚠️  Dependency installation failed!")
            print("You can try manually: pip install -r requirements.txt")
            sys.exit(1)
    else:
        print("⏭️  Skipping dependency installation")
        print("Remember to run: pip install -r requirements.txt")
    
    # Setup environment
    if not setup_environment():
        print("\n⚠️  Environment setup failed!")
        print("You can manually copy .env.example to .env")
    
    # Create directories
    if not create_directories():
        print("\n⚠️  Directory creation had issues")
        print("Directories will be created automatically when needed")
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
