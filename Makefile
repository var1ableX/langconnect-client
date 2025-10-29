.PHONY: build up down restart mcp test

build:
	@echo "🔨 Building Next.js application..."
	@cd next-connect-ui && npm install && npm run build
	@echo "✅ Next.js build completed!"
	@echo ""
	@echo "🔨 Building Docker images..."
	@docker-compose build
	@echo "✅ Docker build completed successfully!"
	@echo "📌 Run 'make up' to start the server"

up:
	@echo "🚀 Starting LangConnect frontend..."
	@echo "⚠️  Note: Connecting to existing LangConnect backend at http://localhost:8080"
	@docker-compose up -d
	@echo "✅ Frontend started successfully!"
	@echo "📌 Access points:"
	@echo "   - Next.js UI: http://localhost:3011"
	@echo "   - Existing API: http://localhost:8080 (from your other project)"
	@echo "   - API Docs: http://localhost:8080/docs"

down:
	@echo "🛑 Stopping LangConnect frontend..."
	@docker-compose down
	@echo "✅ Frontend stopped successfully!"

clean:
	@echo "🧹 Cleaning up old containers..."
	@docker-compose down --remove-orphans
	@docker rm -f next-connect-ui 2>/dev/null || true
	@echo "✅ Cleanup completed!"

restart:
	@echo "🔄 Restarting LangConnect frontend..."
	@docker-compose down
	@docker-compose up -d
	@echo "✅ Frontend restarted successfully!"

mcp:
	@echo "🔧 Creating MCP configuration..."
	@uv run python mcpserver/create_mcp_json.py
	@echo "✅ MCP configuration created successfully!"

TEST_FILE ?= tests/unit_tests

test:
	./run_tests.sh $(TEST_FILE)

