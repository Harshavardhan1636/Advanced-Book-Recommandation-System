# 🔧 DevOps & Technical Excellence Guide

## Book Recommendation System v2.0

**Complete guide for code quality, testing, CI/CD, and deployment**

---

## 📋 **Table of Contents**

1. [Code Quality & Testing](#code-quality--testing)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [Docker & Containerization](#docker--containerization)
4. [Monitoring & Logging](#monitoring--logging)
5. [Deployment](#deployment)

---

## 🧪 **Code Quality & Testing**

### **Testing Framework**

We use `pytest` with 80%+ coverage target.

#### **Run All Tests**
```bash
# Run all tests with coverage
pytest tests/ -v --cov=. --cov-report=term-missing --cov-report=html

# Run specific test file
pytest tests/test_api.py -v

# Run tests by marker
pytest tests/ -v -m unit
pytest tests/ -v -m integration
```

#### **Test Structure**
```
tests/
├── __init__.py
├── conftest.py           # Fixtures and configuration
├── test_api.py           # API endpoint tests
├── test_services.py      # Service layer tests
└── test_integration.py   # Integration tests
```

#### **Writing Tests**
```python
import pytest

@pytest.mark.unit
def test_example(client, sample_book):
    """Test example with fixtures"""
    response = client.get("/api/health")
    assert response.status_code == 200
```

---

### **Code Quality Tools**

#### **1. Black - Code Formatting**
```bash
# Check formatting
black --check .

# Format code
black .

# Format specific file
black api.py
```

**Configuration**: `pyproject.toml`
```toml
[tool.black]
line-length = 100
target-version = ['py311']
```

---

#### **2. Ruff - Fast Linting**
```bash
# Check for issues
ruff check .

# Fix issues automatically
ruff check --fix .

# Check specific file
ruff check api.py
```

**Configuration**: `pyproject.toml`
```toml
[tool.ruff]
line-length = 100
select = ["E", "W", "F", "I", "C", "B", "UP"]
```

---

#### **3. mypy - Type Checking**
```bash
# Type check
mypy api.py --ignore-missing-imports

# Type check all files
mypy . --ignore-missing-imports
```

**Configuration**: `pyproject.toml`
```toml
[tool.mypy]
python_version = "3.11"
ignore_missing_imports = true
```

---

#### **4. Flake8 - Style Guide**
```bash
# Check style
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

# Full check
flake8 . --max-line-length=100
```

---

#### **5. Pylint - Code Analysis**
```bash
# Run pylint
pylint api.py --disable=all --enable=E,F

# Full analysis
pylint api.py
```

---

#### **6. Bandit - Security Linting**
```bash
# Security scan
bandit -r . -f json -o bandit-report.json

# Quick scan
bandit -r . -ll
```

---

#### **7. Safety - Dependency Security**
```bash
# Check for vulnerabilities
safety check

# Check with JSON output
safety check --json
```

---

### **Pre-commit Hooks**

Automatically run quality checks before commits.

#### **Setup**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run on all files
pre-commit run --all-files
```

#### **Configuration**: `.pre-commit-config.yaml`
Includes:
- Black (formatting)
- Ruff (linting)
- isort (import sorting)
- Flake8 (style)
- mypy (type checking)
- Bandit (security)
- YAML/JSON validation

---

### **Makefile Commands**

Quick access to common tasks:

```bash
# Install dependencies
make install

# Run tests
make test

# Run linters
make lint

# Format code
make format

# Clean cache
make clean

# Install pre-commit hooks
make pre-commit
```

---

## 🚀 **CI/CD Pipeline**

### **GitHub Actions**

Automated pipeline on every push and pull request.

#### **Pipeline Stages**

1. **Lint** - Code quality checks
   - Black formatting
   - Ruff linting
   - Flake8 style
   - mypy type checking
   - Pylint analysis

2. **Test** - Unit and integration tests
   - pytest with coverage
   - PostgreSQL service
   - Redis service
   - Coverage report to Codecov

3. **Security** - Security scanning
   - Bandit security scan
   - Safety dependency check

4. **Build** - Docker image build
   - Multi-stage build
   - Layer caching

5. **Deploy** - Production deployment
   - Only on main branch
   - Automated deployment

#### **Configuration**: `.github/workflows/ci-cd.yml`

#### **Status Badges**

Add to README:
```markdown
[![CI/CD](https://github.com/username/repo/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/username/repo/actions)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

---

## 🐳 **Docker & Containerization**

### **Docker Setup**

#### **Build Image**
```bash
# Build image
docker build -t bookrec:latest .

# Build with no cache
docker build --no-cache -t bookrec:latest .
```

#### **Run Container**
```bash
# Run single container
docker run -p 8000:8000 bookrec:latest

# Run with environment variables
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key bookrec:latest
```

---

### **Docker Compose**

Complete stack with all services.

#### **Start Services**
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d api

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
```

#### **Stop Services**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

#### **Services Included**
- **API** - FastAPI application
- **PostgreSQL** - Database
- **Redis** - Cache
- **Elasticsearch** - Search
- **Celery Worker** - Background tasks
- **Celery Beat** - Task scheduler
- **Nginx** - Reverse proxy & load balancer
- **Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboards

---

### **Docker Commands**

```bash
# Build
make docker-build

# Start
make docker-up

# Stop
make docker-down

# View logs
make docker-logs
```

---

## 📊 **Monitoring & Logging**

### **Prometheus Metrics**

Collect and monitor application metrics.

#### **Access Prometheus**
```
http://localhost:9090
```

#### **Metrics Collected**
- API request count
- Response times
- Error rates
- Database connections
- Cache hit rates
- Celery task metrics

#### **Configuration**: `prometheus.yml`

---

### **Grafana Dashboards**

Visualize metrics with beautiful dashboards.

#### **Access Grafana**
```
http://localhost:3001
Username: admin
Password: admin
```

#### **Dashboards**
- API Performance
- Database Metrics
- Cache Performance
- Celery Tasks
- System Resources

---

### **Application Logging**

Structured logging throughout the application.

#### **Log Levels**
- **DEBUG** - Detailed information
- **INFO** - General information
- **WARNING** - Warning messages
- **ERROR** - Error messages
- **CRITICAL** - Critical issues

#### **Log Files**
```
logs/
├── app.log           # Application logs
├── api.log           # API logs
├── celery.log        # Celery logs
└── error.log         # Error logs
```

#### **Configuration**
```python
# config.py
LOG_LEVEL = "INFO"
LOG_FILE = "logs/app.log"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

---

### **Error Tracking with Sentry**

Real-time error tracking and monitoring.

#### **Setup**
```python
# api.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
)
```

#### **Features**
- Real-time error alerts
- Stack traces
- User context
- Performance monitoring
- Release tracking

---

## 🚢 **Deployment**

### **Local Development**

```bash
# Run with uvicorn
python api.py

# Or with auto-reload
uvicorn api:app --reload --host 0.0.0.0 --port 8000

# Using make
make dev
```

---

### **Docker Deployment**

```bash
# Production with Docker Compose
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

---

### **Cloud Deployment**

#### **AWS (ECS/Fargate)**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t bookrec .
docker tag bookrec:latest <account>.dkr.ecr.us-east-1.amazonaws.com/bookrec:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/bookrec:latest

# Deploy to ECS
aws ecs update-service --cluster bookrec-cluster --service bookrec-service --force-new-deployment
```

#### **GCP (Cloud Run)**
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/bookrec
gcloud run deploy bookrec --image gcr.io/PROJECT_ID/bookrec --platform managed
```

#### **Azure (App Service)**
```bash
# Build and push to ACR
az acr build --registry <registry-name> --image bookrec:latest .

# Deploy to App Service
az webapp create --resource-group <group> --plan <plan> --name bookrec --deployment-container-image-name <registry>.azurecr.io/bookrec:latest
```

---

### **Kubernetes Deployment**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookrec-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bookrec-api
  template:
    metadata:
      labels:
        app: bookrec-api
    spec:
      containers:
      - name: api
        image: bookrec:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: bookrec-secrets
              key: database-url
```

```bash
# Deploy
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check status
kubectl get pods
kubectl logs -f <pod-name>
```

---

## 🔒 **Security Best Practices**

### **Environment Variables**
- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Rotate credentials regularly

### **Docker Security**
- Use non-root user
- Scan images for vulnerabilities
- Keep base images updated
- Use multi-stage builds

### **API Security**
- Enable rate limiting
- Use HTTPS in production
- Implement CORS properly
- Validate all inputs
- Use security headers

---

## 📈 **Performance Optimization**

### **Caching Strategy**
- Redis for API responses
- Memory cache for frequent data
- CDN for static assets

### **Database Optimization**
- Use indexes
- Connection pooling
- Query optimization
- Database sharding

### **Load Balancing**
- Nginx reverse proxy
- Multiple API instances
- Health checks
- Auto-scaling

---

## ✅ **Checklist**

### **Before Deployment**
- [ ] All tests passing
- [ ] Code quality checks passing
- [ ] Security scan clean
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Backup strategy in place

### **After Deployment**
- [ ] Health check passing
- [ ] Logs being collected
- [ ] Metrics being recorded
- [ ] Alerts configured
- [ ] Documentation updated
- [ ] Team notified

---

**🎉 Your DevOps pipeline is now complete and production-ready!**

*For questions or issues, refer to the main [README.md](README.md)*
