package config

import (
	"log/slog"
	"os"
	"path/filepath"
)

type SiteConfig struct {
	Name           string
	URL            string
	DefaultOGImage string
}

type Config struct {
	DatabaseURL          string
	Port                 string
	Env                  string
	Site                 SiteConfig
	ClerkSecretKey       string
	ClerkPublishableKey  string
	StripeSecretKey      string
	StripePublishableKey string
	StripeWebhookSecret  string
	TailscaleHostname    string
}

func Load() *Config {
	cfg := &Config{
		DatabaseURL: databaseURL(),
		Port:        getEnvOrDefault("PORT", "3000"),
		Env:         getEnvOrDefault("ENV", "development"),
		Site: SiteConfig{
			Name:           getEnvOrDefault("SITE_NAME", "Platinum Apparel"),
			URL:            siteURL(),
			DefaultOGImage: getEnvOrDefault("DEFAULT_OG_IMAGE", "/static/images/og-default.png"),
		},
		ClerkSecretKey:       os.Getenv("CLERK_SECRET_KEY"),
		ClerkPublishableKey:  os.Getenv("CLERK_PUBLISHABLE_KEY"),
		StripeSecretKey:      os.Getenv("STRIPE_SECRET_KEY"),
		StripePublishableKey: os.Getenv("STRIPE_PUBLISHABLE_KEY"),
		StripeWebhookSecret:  os.Getenv("STRIPE_WEBHOOK_SECRET"),
		TailscaleHostname:    os.Getenv("TAILSCALE_HOSTNAME"),
	}

	return cfg
}

func (c *Config) IsDevelopment() bool {
	return c.Env == "development"
}

func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func databaseURL() string {
	if value := os.Getenv("DATABASE_URL"); value != "" {
		return value
	}

	slog.Warn("DATABASE_URL not set; using temporary SQLite database")
	return filepath.Join(os.TempDir(), "platinumapparel.db")
}

func siteURL() string {
	if value := os.Getenv("SITE_URL"); value != "" {
		return value
	}
	if value := os.Getenv("VERCEL_URL"); value != "" {
		return "https://" + value
	}
	return "http://localhost:3000"
}
