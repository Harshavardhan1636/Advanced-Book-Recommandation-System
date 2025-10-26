.PHONY: help install test lint format clean docker-build docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make test          - Run tests with coverage"
	@echo "  make lint          - Run linters"
	@echo "  make format        - Format code with black"
	@echo "  make clean         - Clean up cache files"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make pre-commit    - Install pre-commit hooks"

install:
	pip install -r requirements.txt
	pip install pytest pytest-cov pytest-asyncio black ruff mypy pylint flake8

test:
	pytest tests/ -v --cov=. --cov-report=term-missing --cov-report=html

test-unit:
	pytest tests/ -v -m unit

test-integration:
	pytest tests/ -v -m integration

lint:
	@echo "Running Black..."
	black --check .
	@echo "Running Ruff..."
	ruff check .
	@echo "Running Flake8..."
	flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
	@echo "Running mypy..."
	mypy api.py --ignore-missing-imports
	@echo "Running Pylint..."
	pylint api.py --disable=all --enable=E,F

format:
	black .
	ruff check --fix .
	isort .

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	rm -rf htmlcov/
	rm -f .coverage

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

pre-commit:
	pip install pre-commit
	pre-commit install
	pre-commit run --all-files

run:
	python api.py

dev:
	uvicorn api:app --reload --host 0.0.0.0 --port 8000
