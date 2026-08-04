package handler

import (
	"io"
	"log/slog"
	"net/http"

	"handler/internal/services/stripe"
	"handler/templates/pages/shop"

	"github.com/labstack/echo/v4"
)

func (h *Handler) Checkout(c echo.Context) error {
	cart := readCart(c)
	return shop.Checkout(cart.Items, cartTotal(cart.Items)).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) CreateCheckoutSession(c echo.Context) error {
	if !h.stripe.IsConfigured() {
		return c.JSON(http.StatusServiceUnavailable, map[string]string{
			"error": "Payment processing is not configured",
		})
	}

	cart := readCart(c)
	if len(cart.Items) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Your selection is empty"})
	}
	items := make([]stripe.CartItem, 0, len(cart.Items))
	for _, item := range cart.Items {
		items = append(items, stripe.CartItem{Name: item.Name, Price: item.Price, Quantity: item.Quantity, ImageURL: h.cfg.Site.URL + item.ImageURL})
	}

	successURL := h.cfg.Site.URL + "/checkout/success?session_id={CHECKOUT_SESSION_ID}"
	cancelURL := h.cfg.Site.URL + "/checkout/cancel"

	session, err := h.stripe.CreateCheckoutSession(items, successURL, cancelURL, "")
	if err != nil {
		slog.Error("failed to create checkout session", "error", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create checkout session",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"url": session.URL,
	})
}

func (h *Handler) CheckoutSuccess(c echo.Context) error {
	sessionID := c.QueryParam("session_id")
	if sessionID == "" {
		return c.Redirect(http.StatusFound, "/")
	}

	// Verify the session with Stripe
	if h.stripe.IsConfigured() {
		_, err := h.stripe.GetCheckoutSession(sessionID)
		if err != nil {
			slog.Error("failed to verify checkout session", "error", err, "session_id", sessionID)
			return c.Redirect(http.StatusFound, "/")
		}
	}
	clearCart(c)

	return shop.CheckoutSuccess(sessionID).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) CheckoutCancel(c echo.Context) error {
	return shop.CheckoutCancel().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) StripeWebhook(c echo.Context) error {
	if !h.stripe.IsConfigured() {
		return c.NoContent(http.StatusOK)
	}

	signature := c.Request().Header.Get("Stripe-Signature")
	if signature == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing Stripe signature"})
	}

	body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Failed to read body"})
	}

	event, err := h.stripe.VerifyWebhook(body, signature)
	if err != nil {
		slog.Error("webhook signature verification failed", "error", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid signature"})
	}

	switch event.Type {
	case "checkout.session.completed":
		session, err := stripe.ParseCheckoutSessionFromEvent(&event)
		if err != nil {
			slog.Error("failed to parse checkout session", "error", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Failed to parse event"})
		}
		slog.Info("checkout completed", "session_id", session.ID, "amount", session.AmountTotal)
		// In production: Update order status, send confirmation email, etc.

	case "payment_intent.succeeded":
		slog.Info("payment succeeded", "event_id", event.ID)

	case "payment_intent.payment_failed":
		slog.Warn("payment failed", "event_id", event.ID)
	}

	return c.NoContent(http.StatusOK)
}
