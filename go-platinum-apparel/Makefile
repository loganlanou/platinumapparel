SHELL := /bin/bash

.PHONY: dev build test lint generate css css-watch migrate migrate-down migrate-status migrate-create setup clean run help

BINARY_NAME=platinumapparel
MIGRATIONS_DIR=migrations

dev:
	@if [ -f tmp/air-combined.log ]; then \
		mv tmp/air-combined.log tmp/air-combined-$$(date +%Y%m%d-%H%M%S).log; \
	fi
	@ls -t tmp/air-combined-*.log 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
	@air 2>&1 | tee tmp/air-combined.log

build: generate css
	go build -o $(BINARY_NAME) ./cmd/server

test:
	go test -v -race ./...

lint:
	golangci-lint run
	templ fmt templates/

generate:
	templ generate
	sqlc generate -f sqlc/sqlc.yaml

css:
	npx @tailwindcss/cli -i static/css/input.css -o static/css/output.css --minify

css-watch:
	npx @tailwindcss/cli -i static/css/input.css -o static/css/output.css --watch

migrate:
	goose -dir $(MIGRATIONS_DIR) sqlite3 "$$DATABASE_URL" up

migrate-down:
	goose -dir $(MIGRATIONS_DIR) sqlite3 "$$DATABASE_URL" down

migrate-status:
	goose -dir $(MIGRATIONS_DIR) sqlite3 "$$DATABASE_URL" status

migrate-create:
ifndef NAME
	$(error NAME is required. Usage: make migrate-create NAME=create_users)
endif
	goose -dir $(MIGRATIONS_DIR) create $(NAME) sql

setup:
	go install github.com/air-verse/air@latest
	go install github.com/a-h/templ/cmd/templ@latest
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	go install github.com/pressly/goose/v3/cmd/goose@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

clean:
	rm -f $(BINARY_NAME)
	rm -rf tmp/
	rm -f static/css/output.css

run: build
	./$(BINARY_NAME)

help:
	@echo "Available targets:"
	@echo "  dev            - Run with Air hot reload"
	@echo "  build          - Build the binary"
	@echo "  test           - Run tests"
	@echo "  lint           - Run golangci-lint and templ fmt"
	@echo "  generate       - Generate templ and sqlc code"
	@echo "  css            - Build Tailwind CSS"
	@echo "  css-watch      - Watch and rebuild Tailwind CSS"
	@echo "  migrate        - Run database migrations"
	@echo "  migrate-down   - Rollback last migration"
	@echo "  migrate-status - Show migration status"
	@echo "  migrate-create - Create new migration (NAME=xxx)"
	@echo "  setup          - Install development tools"
	@echo "  clean          - Remove build artifacts"
	@echo "  run            - Build and run the server"
