package database

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"

	"platinumapparel/internal/database/sqlc"
)

type DB struct {
	Conn    *sql.DB
	Queries *sqlc.Queries
}

func New(ctx context.Context, databasePath string) (*DB, error) {
	// Ensure directory exists for SQLite database
	dir := filepath.Dir(databasePath)
	if dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return nil, fmt.Errorf("unable to create database directory: %w", err)
		}
	}

	conn, err := sql.Open("sqlite", databasePath+"?_foreign_keys=on")
	if err != nil {
		return nil, fmt.Errorf("unable to open database: %w", err)
	}

	if err := conn.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	// Enable WAL mode for better concurrent access
	_, err = conn.ExecContext(ctx, "PRAGMA journal_mode=WAL")
	if err != nil {
		return nil, fmt.Errorf("unable to enable WAL mode: %w", err)
	}

	return &DB{
		Conn:    conn,
		Queries: sqlc.New(conn),
	}, nil
}

func (db *DB) Close() {
	db.Conn.Close()
}
