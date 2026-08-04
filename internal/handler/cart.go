package handler

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"handler/templates/components/products"

	"github.com/labstack/echo/v4"
)

const cartCookieName = "platinum_cart"

type browserCart struct {
	Items []products.CartItem `json:"items"`
}

func (h *Handler) Cart(c echo.Context) error {
	cart := readCart(c)
	return products.CartDrawer(cart.Items, cartTotal(cart.Items)).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) AddToCart(c echo.Context) error {
	item := products.CartItem{
		ID:       c.FormValue("product_id"),
		Name:     c.FormValue("product_name"),
		ImageURL: c.FormValue("image_url"),
		Quantity: parsePositiveInt(c.FormValue("quantity"), 1),
		Price:    parsePositiveInt(c.FormValue("price_cents"), 0),
	}
	if item.ID == "" || item.Name == "" || item.Price <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid product selection"})
	}

	cart := readCart(c)
	found := false
	for i := range cart.Items {
		if cart.Items[i].ID == item.ID {
			cart.Items[i].Quantity += item.Quantity
			if cart.Items[i].Quantity > 10 {
				cart.Items[i].Quantity = 10
			}
			found = true
			break
		}
	}
	if !found {
		cart.Items = append(cart.Items, item)
	}
	writeCart(c, cart)
	setCartTrigger(c, cart.Items)
	return products.CartDrawer(cart.Items, cartTotal(cart.Items)).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) RemoveFromCart(c echo.Context) error {
	productID := c.FormValue("product_id")
	cart := readCart(c)
	kept := cart.Items[:0]
	for _, item := range cart.Items {
		if item.ID != productID {
			kept = append(kept, item)
		}
	}
	cart.Items = kept
	writeCart(c, cart)
	setCartTrigger(c, cart.Items)
	return products.CartDrawer(cart.Items, cartTotal(cart.Items)).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) UpdateCartItem(c echo.Context) error {
	productID := c.FormValue("product_id")
	quantity := parsePositiveInt(c.FormValue("quantity"), 0)
	cart := readCart(c)
	kept := cart.Items[:0]
	for _, item := range cart.Items {
		if item.ID == productID {
			if quantity <= 0 {
				continue
			}
			if quantity > 10 {
				quantity = 10
			}
			item.Quantity = quantity
		}
		kept = append(kept, item)
	}
	cart.Items = kept
	writeCart(c, cart)
	setCartTrigger(c, cart.Items)
	return products.CartDrawer(cart.Items, cartTotal(cart.Items)).Render(c.Request().Context(), c.Response().Writer)
}

func readCart(c echo.Context) browserCart {
	cookie, err := c.Cookie(cartCookieName)
	if err != nil || cookie.Value == "" {
		return browserCart{}
	}
	payload, err := base64.RawURLEncoding.DecodeString(cookie.Value)
	if err != nil {
		return browserCart{}
	}
	var cart browserCart
	if err := json.Unmarshal(payload, &cart); err != nil {
		return browserCart{}
	}
	return cart
}

func writeCart(c echo.Context, cart browserCart) {
	payload, _ := json.Marshal(cart)
	c.SetCookie(&http.Cookie{
		Name:     cartCookieName,
		Value:    base64.RawURLEncoding.EncodeToString(payload),
		Path:     "/",
		MaxAge:   int((30 * 24 * time.Hour).Seconds()),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   c.IsTLS(),
	})
}

func clearCart(c echo.Context) {
	c.SetCookie(&http.Cookie{Name: cartCookieName, Value: "", Path: "/", MaxAge: -1, HttpOnly: true, SameSite: http.SameSiteLaxMode, Secure: c.IsTLS()})
}

func cartTotal(items []products.CartItem) int64 {
	var total int64
	for _, item := range items {
		total += item.Price * item.Quantity
	}
	return total
}

func cartQuantity(items []products.CartItem) int64 {
	var quantity int64
	for _, item := range items {
		quantity += item.Quantity
	}
	return quantity
}

func parsePositiveInt(value string, fallback int64) int64 {
	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return fallback
	}
	return parsed
}

func setCartTrigger(c echo.Context, items []products.CartItem) {
	trigger, _ := json.Marshal(map[string]map[string]int64{"cart-updated": {"count": cartQuantity(items)}})
	c.Response().Header().Set("HX-Trigger", string(trigger))
}
