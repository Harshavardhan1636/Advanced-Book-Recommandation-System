"""
Pre-flight Check Script
Comprehensive system check before starting the application
"""

import sys
import os
from pathlib import Path
import importlib

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))


class PreflightChecker:
    """Comprehensive pre-flight checker"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.passed = []
    
    def check_python_version(self):
        """Check Python version"""
        print("🔍 Checking Python version...")
        version = sys.version_info
        
        if version.major == 3 and version.minor >= 8:
            self.passed.append(f"Python {version.major}.{version.minor}.{version.micro}")
            print(f"  ✅ Python {version.major}.{version.minor}.{version.micro}")
            return True
        else:
            self.errors.append(f"Python 3.8+ required, found {version.major}.{version.minor}")
            print(f"  ❌ Python {version.major}.{version.minor} (3.8+ required)")
            return False
    
    def check_core_dependencies(self):
        """Check core dependencies"""
        print("\n🔍 Checking core dependencies...")
        
        core_deps = {
            'fastapi': 'FastAPI web framework',
            'uvicorn': 'ASGI server',
            'pydantic': 'Data validation',
            'requests': 'HTTP library',
            'rich': 'Terminal formatting',
        }
        
        for package, description in core_deps.items():
            try:
                importlib.import_module(package)
                self.passed.append(f"{package} ({description})")
                print(f"  ✅ {package} - {description}")
            except ImportError:
                self.errors.append(f"{package} - {description}")
                print(f"  ❌ {package} - {description} - MISSING")
    
    def check_optional_dependencies(self):
        """Check optional dependencies"""
        print("\n🔍 Checking optional dependencies...")
        
        optional_deps = {
            'redis': 'Caching',
            'elasticsearch': 'Search',
            'celery': 'Background tasks',
            'sqlalchemy': 'Database ORM',
            'google.generativeai': 'Gemini AI',
            'sklearn': 'Machine Learning',
        }
        
        for package, description in optional_deps.items():
            try:
                importlib.import_module(package)
                self.passed.append(f"{package} ({description})")
                print(f"  ✅ {package} - {description}")
            except ImportError:
                self.warnings.append(f"{package} - {description}")
                print(f"  ⚠️  {package} - {description} - Optional")
    
    def check_project_structure(self):
        """Check project structure"""
        print("\n🔍 Checking project structure...")
        
        required_dirs = ['models', 'services', 'database', 'ui', 'utils']
        required_files = ['api.py', 'config.py', 'requirements.txt']
        
        base_path = Path(__file__).parent
        
        for dir_name in required_dirs:
            dir_path = base_path / dir_name
            if dir_path.exists() and dir_path.is_dir():
                self.passed.append(f"Directory: {dir_name}/")
                print(f"  ✅ {dir_name}/ directory")
            else:
                self.errors.append(f"Directory missing: {dir_name}/")
                print(f"  ❌ {dir_name}/ directory - MISSING")
        
        for file_name in required_files:
            file_path = base_path / file_name
            if file_path.exists() and file_path.is_file():
                self.passed.append(f"File: {file_name}")
                print(f"  ✅ {file_name}")
            else:
                self.errors.append(f"File missing: {file_name}")
                print(f"  ❌ {file_name} - MISSING")
    
    def check_services(self):
        """Check service files"""
        print("\n🔍 Checking service files...")
        
        services_dir = Path(__file__).parent / 'services'
        if not services_dir.exists():
            self.errors.append("Services directory missing")
            print("  ❌ services/ directory not found")
            return
        
        expected_services = [
            'ml_recommender.py',
            'gemini_service.py',
            'gamification.py',
            'analytics.py',
            'security.py',
            'monetization.py',
            'scalability.py',
        ]
        
        for service in expected_services:
            service_path = services_dir / service
            if service_path.exists():
                self.passed.append(f"Service: {service}")
                print(f"  ✅ {service}")
            else:
                self.warnings.append(f"Service missing: {service}")
                print(f"  ⚠️  {service} - Optional")
    
    def check_environment(self):
        """Check environment configuration"""
        print("\n🔍 Checking environment configuration...")
        
        env_file = Path(__file__).parent / '.env'
        env_example = Path(__file__).parent / '.env.example'
        
        if env_file.exists():
            self.passed.append(".env file")
            print("  ✅ .env file found")
        else:
            self.warnings.append(".env file not found")
            print("  ⚠️  .env file not found (using defaults)")
            
            if env_example.exists():
                print("  💡 Copy .env.example to .env for custom configuration")
    
    def check_ports(self):
        """Check if required ports are available"""
        print("\n🔍 Checking port availability...")
        
        import socket
        
        ports_to_check = {
            8000: 'API Server',
            5432: 'PostgreSQL (optional)',
            6379: 'Redis (optional)',
            9200: 'Elasticsearch (optional)',
        }
        
        for port, service in ports_to_check.items():
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if port == 8000:
                if result != 0:
                    self.passed.append(f"Port {port} ({service})")
                    print(f"  ✅ Port {port} available - {service}")
                else:
                    self.warnings.append(f"Port {port} in use")
                    print(f"  ⚠️  Port {port} in use - {service}")
            else:
                if result == 0:
                    self.passed.append(f"Port {port} ({service})")
                    print(f"  ✅ Port {port} active - {service}")
                else:
                    print(f"  ℹ️  Port {port} not active - {service} (optional)")
    
    def check_api_imports(self):
        """Check if API can be imported"""
        print("\n🔍 Checking API imports...")
        
        try:
            import api
            self.passed.append("API module import")
            print("  ✅ API module imports successfully")
            
            # Check if app exists
            if hasattr(api, 'app'):
                self.passed.append("FastAPI app instance")
                print("  ✅ FastAPI app instance found")
            else:
                self.errors.append("FastAPI app instance not found")
                print("  ❌ FastAPI app instance not found")
                
        except Exception as e:
            self.errors.append(f"API import error: {str(e)}")
            print(f"  ❌ API import failed: {str(e)}")
    
    def print_summary(self):
        """Print summary of checks"""
        print("\n" + "=" * 60)
        print("📊 PRE-FLIGHT CHECK SUMMARY")
        print("=" * 60)
        
        print(f"\n✅ Passed: {len(self.passed)}")
        print(f"⚠️  Warnings: {len(self.warnings)}")
        print(f"❌ Errors: {len(self.errors)}")
        
        if self.errors:
            print("\n❌ ERRORS (Must Fix):")
            for error in self.errors:
                print(f"  • {error}")
        
        if self.warnings:
            print("\n⚠️  WARNINGS (Optional):")
            for warning in self.warnings:
                print(f"  • {warning}")
        
        print("\n" + "=" * 60)
        
        if self.errors:
            print("❌ PRE-FLIGHT CHECK FAILED")
            print("\n💡 Fix the errors above before starting the application")
            print("📦 Install missing dependencies: pip install -r requirements.txt")
            return False
        else:
            print("✅ PRE-FLIGHT CHECK PASSED")
            print("\n🚀 System is ready to start!")
            print("📝 Run: python start.py")
            return True
    
    def run_all_checks(self):
        """Run all checks"""
        print("\n" + "=" * 60)
        print("🔍 RUNNING PRE-FLIGHT CHECKS")
        print("=" * 60 + "\n")
        
        self.check_python_version()
        self.check_core_dependencies()
        self.check_optional_dependencies()
        self.check_project_structure()
        self.check_services()
        self.check_environment()
        self.check_ports()
        self.check_api_imports()
        
        return self.print_summary()


def main():
    """Main function"""
    checker = PreflightChecker()
    success = checker.run_all_checks()
    
    if not success:
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("🎉 ALL CHECKS PASSED - READY TO START!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print("  1. Run: python start.py")
    print("  2. Visit: http://localhost:8000/api/docs")
    print("  3. Enjoy! 📚✨")
    print()


if __name__ == "__main__":
    main()
