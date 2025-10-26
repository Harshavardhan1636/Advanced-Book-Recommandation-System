"""
Application Monitoring Script
Checks both backend and frontend for errors and warnings
"""

import requests
import time
from datetime import datetime

def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")

def check_backend():
    """Check backend health"""
    print("🔍 Checking Backend (http://localhost:8000)...")
    
    try:
        # Health check
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Backend Status: {data.get('status', 'unknown')}")
            print(f"  ✅ Timestamp: {data.get('timestamp', 'N/A')}")
            services = data.get('services', {})
            for service, status in services.items():
                print(f"  ✅ {service}: {status}")
            return True, []
        else:
            error = f"Backend returned status {response.status_code}"
            print(f"  ❌ {error}")
            return False, [error]
    except requests.exceptions.ConnectionError:
        error = "Backend not responding (connection refused)"
        print(f"  ❌ {error}")
        return False, [error]
    except Exception as e:
        error = f"Backend error: {str(e)}"
        print(f"  ❌ {error}")
        return False, [error]

def check_frontend():
    """Check frontend health"""
    print("\n🔍 Checking Frontend (http://localhost:3000)...")
    
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print(f"  ✅ Frontend Status: Running")
            print(f"  ✅ Status Code: {response.status_code}")
            print(f"  ✅ Content Length: {len(response.content)} bytes")
            return True, []
        else:
            error = f"Frontend returned status {response.status_code}"
            print(f"  ❌ {error}")
            return False, [error]
    except requests.exceptions.ConnectionError:
        error = "Frontend not responding (connection refused)"
        print(f"  ❌ {error}")
        return False, [error]
    except Exception as e:
        error = f"Frontend error: {str(e)}"
        print(f"  ❌ {error}")
        return False, [error]

def test_api_endpoints():
    """Test key API endpoints"""
    print("\n🔍 Testing API Endpoints...")
    
    endpoints = [
        ("GET", "/api/health", "Health Check"),
        ("GET", "/api/docs", "API Documentation"),
        ("POST", "/api/books/search", "Book Search"),
    ]
    
    errors = []
    
    for method, path, description in endpoints:
        try:
            url = f"http://localhost:8000{path}"
            
            if method == "GET":
                response = requests.get(url, timeout=5)
            elif method == "POST":
                # For search, send a simple query
                response = requests.post(
                    url,
                    json={"query": "python"},
                    timeout=5
                )
            
            if response.status_code in [200, 307]:  # 307 is redirect (docs)
                print(f"  ✅ {description}: {response.status_code}")
            else:
                error = f"{description}: {response.status_code}"
                print(f"  ⚠️  {error}")
                errors.append(error)
        except Exception as e:
            error = f"{description}: {str(e)}"
            print(f"  ❌ {error}")
            errors.append(error)
    
    return len(errors) == 0, errors

def main():
    """Main monitoring function"""
    print_header("📊 APPLICATION MONITORING")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    all_errors = []
    all_warnings = []
    
    # Check Backend
    backend_ok, backend_errors = check_backend()
    all_errors.extend(backend_errors)
    
    # Check Frontend
    frontend_ok, frontend_errors = check_frontend()
    all_errors.extend(frontend_errors)
    
    # Test API Endpoints
    api_ok, api_errors = test_api_endpoints()
    all_errors.extend(api_errors)
    
    # Summary
    print_header("📊 MONITORING SUMMARY")
    
    print(f"Backend:  {'✅ Running' if backend_ok else '❌ Error'}")
    print(f"Frontend: {'✅ Running' if frontend_ok else '❌ Error'}")
    print(f"API:      {'✅ Working' if api_ok else '⚠️  Issues'}")
    
    print(f"\nTotal Errors: {len(all_errors)}")
    print(f"Total Warnings: {len(all_warnings)}")
    
    if all_errors:
        print("\n❌ Errors Found:")
        for i, error in enumerate(all_errors, 1):
            print(f"  {i}. {error}")
    
    if all_warnings:
        print("\n⚠️  Warnings Found:")
        for i, warning in enumerate(all_warnings, 1):
            print(f"  {i}. {warning}")
    
    if not all_errors and not all_warnings:
        print("\n🎉 NO ERRORS OR WARNINGS!")
        print("✅ Application is running perfectly!")
    
    print("\n" + "=" * 70)
    print("  ACCESS POINTS")
    print("=" * 70)
    print("\n✅ Backend API: http://localhost:8000/api/docs")
    print("✅ Frontend App: http://localhost:3000")
    print("✅ Health Check: http://localhost:8000/api/health")
    print()
    
    return len(all_errors) == 0

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⏸️  Monitoring stopped")
        exit(0)
    except Exception as e:
        print(f"\n❌ Monitoring error: {e}")
        exit(1)
