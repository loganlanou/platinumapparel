package meta

import (
	"context"

	"platinumapparel/internal/config"
	"platinumapparel/internal/ctxkeys"
)

func SiteFromCtx(ctx context.Context) config.SiteConfig {
	if cfg, ok := ctx.Value(ctxkeys.SiteConfig).(config.SiteConfig); ok {
		return cfg
	}
	return config.SiteConfig{Name: "Platinum Apparel"}
}

func SiteNameFromCtx(ctx context.Context) string {
	return SiteFromCtx(ctx).Name
}

func SiteURLFromCtx(ctx context.Context) string {
	return SiteFromCtx(ctx).URL
}

func ClerkPublishableKeyFromCtx(ctx context.Context) string {
	if key, ok := ctx.Value(ctxkeys.ClerkPublishableKey).(string); ok {
		return key
	}
	return ""
}

func StripePublishableKeyFromCtx(ctx context.Context) string {
	if key, ok := ctx.Value(ctxkeys.StripePublishableKey).(string); ok {
		return key
	}
	return ""
}
