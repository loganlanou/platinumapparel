package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"platinumapparel/internal/config"
	"platinumapparel/internal/database"
	"platinumapparel/internal/handler"
	"platinumapparel/internal/middleware"
	"platinumapparel/internal/services/clerk"
	"platinumapparel/internal/services/stripe"

	"github.com/labstack/echo/v4"
)

func main() {
	cfg := config.Load()

	ctx := context.Background()
	db, err := database.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	// Initialize services
	clerkSvc := clerk.New(cfg.ClerkSecretKey)
	stripeSvc := stripe.New(cfg.StripeSecretKey, cfg.StripeWebhookSecret)

	e := echo.New()
	e.HideBanner = true
	e.HidePort = true

	middleware.Setup(e, cfg, clerkSvc)

	h := handler.New(cfg, db, clerkSvc, stripeSvc)
	h.RegisterRoutes(e)

	go func() {
		addr := ":" + cfg.Port
		slog.Info("starting server", "port", cfg.Port, "env", cfg.Env, "url", "http://localhost:"+cfg.Port)
		if err := e.Start(addr); err != nil {
			slog.Info("shutting down server")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		slog.Error("server shutdown error", "error", err)
	}

	slog.Info("server stopped")
}
