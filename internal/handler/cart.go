package handler

import (
	"net/http"

	"platinumapparel/templates/components/products"

	"github.com/labstack/echo/v4"
)

func (h *Handler) Cart(c echo.Context) error {
	// For now, return empty cart component
	// In production, this would fetch from database based on user session
	return products.CartDrawer(nil, 0).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) AddToCart(c echo.Context) error {
	// HTMX handler for adding items to cart
	// productID := c.FormValue("product_id")
	// quantity := c.FormValue("quantity")

	// In production:
	// 1. Get user from session/Clerk
	// 2. Add item to cart_items table
	// 3. Return updated cart count badge

	c.Response().Header().Set("HX-Trigger", "cart-updated")
	return c.HTML(http.StatusOK, `<span class="cart-count">1</span>`)
}

func (h *Handler) RemoveFromCart(c echo.Context) error {
	// HTMX handler for removing items from cart
	// productID := c.FormValue("product_id")

	c.Response().Header().Set("HX-Trigger", "cart-updated")
	return c.HTML(http.StatusOK, "")
}

func (h *Handler) UpdateCartItem(c echo.Context) error {
	// HTMX handler for updating cart item quantity
	// productID := c.FormValue("product_id")
	// quantity := c.FormValue("quantity")

	c.Response().Header().Set("HX-Trigger", "cart-updated")
	return c.HTML(http.StatusOK, `<span class="item-total">$0.00</span>`)
}
