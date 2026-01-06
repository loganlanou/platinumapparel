package handler

import (
	"platinumapparel/templates/pages/shop"

	"github.com/labstack/echo/v4"
)

func (h *Handler) Shop(c echo.Context) error {
	return shop.Index().Render(c.Request().Context(), c.Response().Writer)
}

func (h *Handler) ShopCategory(c echo.Context) error {
	category := c.Param("category")
	return shop.Category(category).Render(c.Request().Context(), c.Response().Writer)
}
