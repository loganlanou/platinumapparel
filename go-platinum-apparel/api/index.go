package handler

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"sync"

	"platinumapparel/internal/config"
	"platinumapparel/internal/database"
	"platinumapparel/internal/handler"
	"platinumapparel/internal/middleware"
	"platinumapparel/internal/services/clerk"
	"platinumapparel/internal/services/stripe"

	"github.com/labstack/echo/v4"
)

var (
	e    *echo.Echo
	once sync.Once
)

func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(initApp)
	e.ServeHTTP(w, r)
}

func initApp() {
	cfg := config.Load()

	ctx := context.Background()
	db, err := database.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}

	// Initialize services
	clerkSvc := clerk.New(cfg.ClerkSecretKey)
	stripeSvc := stripe.New(cfg.StripeSecretKey, cfg.StripeWebhookSecret)

	e = echo.New()
	e.HideBanner = true
	e.HidePort = true

	middleware.Setup(e, cfg, clerkSvc)

	h := handler.New(cfg, db, clerkSvc, stripeSvc)
	h.RegisterRoutes(e)

	slog.Info("app initialized for serverless")
}
