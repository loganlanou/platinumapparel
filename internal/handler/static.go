package handler

import (
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/labstack/echo/v4"
)

const (
	staticRoot    = "static"
	optimizedRoot = "static/optimized"
)

func (h *Handler) StaticAsset(c echo.Context) error {
	assetPath, ok := sanitizeStaticPath(c.Param("*"))
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	filePath := resolveStaticPath(assetPath)
	if filePath == "" {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	setStaticCacheHeaders(c, assetPath)
	return c.File(filePath)
}

func sanitizeStaticPath(raw string) (string, bool) {
	if raw == "" || strings.ContainsRune(raw, 0) {
		return "", false
	}

	clean := path.Clean("/" + raw)
	if clean == "/" {
		return "", false
	}

	return strings.TrimPrefix(clean, "/"), true
}

func resolveStaticPath(assetPath string) string {
	if optimized := optimizedAssetPath(assetPath); optimized != "" && fileExists(optimized) {
		return optimized
	}

	original := filepath.Join(staticRoot, filepath.FromSlash(assetPath))
	if fileExists(original) {
		return original
	}

	return ""
}

func optimizedAssetPath(assetPath string) string {
	if !strings.HasPrefix(assetPath, "images/") {
		return ""
	}

	ext := strings.ToLower(filepath.Ext(assetPath))
	switch ext {
	case ".jpg", ".jpeg":
		return filepath.Join(optimizedRoot, filepath.FromSlash(assetPath))
	default:
		return ""
	}
}

func setStaticCacheHeaders(c echo.Context, assetPath string) {
	ext := strings.ToLower(filepath.Ext(assetPath))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf":
		c.Response().Header().Set(echo.HeaderCacheControl, "public, max-age=31536000, immutable")
	case ".css", ".js":
		c.Response().Header().Set(echo.HeaderCacheControl, "public, max-age=604800")
	}
}

func fileExists(filePath string) bool {
	info, err := os.Stat(filePath)
	return err == nil && !info.IsDir()
}
