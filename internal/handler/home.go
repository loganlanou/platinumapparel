package handler

import (
	"net/http"

	"handler/templates/pages"

	"github.com/labstack/echo/v4"
)

func (h *Handler) Health(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) Home(c echo.Context) error {
	return pages.Home().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) Collections(c echo.Context) error {
	return pages.Collections().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) CollectionDetail(c echo.Context) error {
	slug := c.Param("slug")
	if !pages.IsKnownCollection(slug) {
		return echo.NewHTTPError(http.StatusNotFound)
	}
	return pages.CollectionDetail(slug).Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) Featured(c echo.Context) error {
	return pages.Featured().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) Craft(c echo.Context) error {
	return pages.Craft().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) Heritage(c echo.Context) error {
	return pages.Heritage().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) Bespoke(c echo.Context) error {
	return pages.Bespoke().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) Concierge(c echo.Context) error {
	return pages.Concierge().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) ProductDetail(c echo.Context) error {
	slug := c.Param("slug")
	if !pages.ProductExists(slug) {
		return echo.NewHTTPError(http.StatusNotFound)
	}
	return pages.ProductDetail(slug).Render(c.Request().Context(), c.Response().Writer)
}
