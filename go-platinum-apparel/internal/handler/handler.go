package handler

import (
	"platinumapparel/internal/config"
	"platinumapparel/internal/database"
	"platinumapparel/internal/services/clerk"
	"platinumapparel/internal/services/stripe"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	cfg     *config.Config
	db      *database.DB
	clerk   *clerk.Service
	stripe  *stripe.Service
}

func New(cfg *config.Config, db *database.DB, clerkSvc *clerk.Service, stripeSvc *stripe.Service) *Handler {
	return &Handler{
		cfg:     cfg,
		db:      db,
		clerk:   clerkSvc,
		stripe:  stripeSvc,
	}
}

func (h *Handler) RegisterRoutes(e *echo.Echo) {
	// Static files
	e.Static("/static", "static")

	// Health check
	e.GET("/health", h.Health)

	// Public routes
	e.GET("/", h.Home)
	e.GET("/collections", h.Collections)
	e.GET("/collections/:slug", h.CollectionDetail)
	e.GET("/featured", h.Featured)
	e.GET("/craft", h.Craft)
	e.GET("/heritage", h.Heritage)
	e.GET("/bespoke", h.Bespoke)
	e.GET("/product/:slug", h.ProductDetail)

	// Shop routes
	shop := e.Group("/shop")
	shop.GET("", h.Shop)
	shop.GET("/category/:category", h.ShopCategory)

	// Cart routes (HTMX)
	cart := e.Group("/cart")
	cart.GET("", h.Cart)
	cart.POST("/add", h.AddToCart)
	cart.POST("/remove", h.RemoveFromCart)
	cart.POST("/update", h.UpdateCartItem)

	// Checkout routes
	checkout := e.Group("/checkout")
	checkout.GET("", h.Checkout)
	checkout.POST("/create-session", h.CreateCheckoutSession)
	checkout.GET("/success", h.CheckoutSuccess)
	checkout.GET("/cancel", h.CheckoutCancel)

	// Webhook
	e.POST("/webhook/stripe", h.StripeWebhook)

	// Auth routes (Clerk handles most of this client-side)
	auth := e.Group("/auth")
	auth.GET("/callback", h.AuthCallback)
}
