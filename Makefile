.PHONY: format lint lint-fix build up up-dev down logs restart clean help test mcp

format:
	ruff format .
	ruff check --fix .

unsafe_fixes:
	ruff check --fix --unsafe-fixes .

lint:
	ruff check .
	ruff format --diff

TEST_FILE ?= tests/unit_tests

test:
	./run_tests.sh $(TEST_FILE)

mcp:
	@echo "🔧 Creating MCP configuration..."
	@uv run python mcp/create_mcp_json.py
	@echo "✅ MCP configuration created successfully!"

help:
	@echo "Available commands:"
	@echo "  make format    - Format code with ruff"
	@echo "  make lint      - Check code with ruff"
	@echo "  make lint-fix  - Fix linting issues with ruff"
	@echo "  make test      - Run unit tests"
	@echo "  make mcp       - Create MCP configuration file"
	@echo "  make build     - Build Docker images"
	@echo "  make up        - Start all services in detached mode"
	@echo "  make up-dev    - Start all services with live reload"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs of all services"
	@echo "  make restart   - Restart all services"
	@echo "  make clean     - Remove containers, volumes, and images"

build:
	@echo "🔨 Building Docker images..."
	@docker-compose build
	@echo "✅ Build completed successfully!"
	@echo "📌 Run 'make up' to start the server"

up:
	@echo "🚀 Starting LangConnect server..."
	@docker-compose up -d
	@echo "✅ Server started successfully!"
	@echo "📌 Access points:"
	@echo "   - API Server: http://localhost:8080"
	@echo "   - API Docs: http://localhost:8080/docs"
	@echo "   - Next.js UI: http://localhost:3000"
	@echo "   - PostgreSQL: localhost:5432"
	@echo ""
	@echo "💡 Run 'make logs' to view server logs"

up-dev:
	@echo "🚀 Starting LangConnect server in development mode..."
	@echo "📌 Access points:"
	@echo "   - API Server: http://localhost:8080"
	@echo "   - API Docs: http://localhost:8080/docs"
	@echo "   - Next.js UI: http://localhost:3000"
	@echo "   - PostgreSQL: localhost:5432"
	@echo ""
	docker-compose up

down:
	@echo "🛑 Stopping LangConnect server..."
	@docker-compose down
	@echo "✅ Server stopped successfully!"

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	@echo "🧹 Cleaning up containers, volumes, and images..."
	@docker-compose down -v
	@docker rmi langconnect-api:latest 2>/dev/null || true
	@echo "✅ Cleanup completed!"
