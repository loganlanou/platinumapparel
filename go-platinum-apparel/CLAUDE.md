# Platinum Apparel - Go Web Application

Luxury menswear, jewelry, and timepieces e-commerce platform built with Go, Templ, Tailwind CSS, and HTMX.

## Critical Build Error Check

**ALWAYS check `./tmp/air-combined.log` after making code changes.**

This log contains:
- Compilation errors
- Template generation errors (templ)
- SQL generation errors (sqlc)
- Runtime errors

Never assume code changes succeeded without checking this log.

## Development Workflow

`make dev` is always running during development. It automatically:
1. Kills existing process on port 3000
2. Regenerates Templ templates
3. Regenerates sqlc queries
4. Runs `go mod tidy`
5. Rebuilds and restarts the server

**You do NOT need to manually run:**
- `templ generate`
- `sqlc generate`
- `go build`
- `air`

## Environment Configuration

All configuration via `.envrc` with direnv:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `./data/platinumapparel.db` |
| `PORT` | Server port | `3000` |
| `ENV` | Environment | `development` |
| `LOG_LEVEL` | Log verbosity | `DEBUG` |
| `SITE_NAME` | Site name for meta tags | `Platinum Apparel` |
| `SITE_URL` | Site URL for OG tags | `http://localhost:3000` |
| `CLERK_SECRET_KEY` | Clerk auth secret | `sk_test_...` |
| `CLERK_PUBLISHABLE_KEY` | Clerk auth public key | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

## Key Commands

| Command | What it does |
|---------|--------------|
| `make dev` | Start with hot reload (main workflow) |
| `make build` | Build production binary |
| `make test` | Run tests with race detection |
| `make lint` | Run golangci-lint and templ fmt |
| `make generate` | Regenerate templ + sqlc code |
| `make migrate` | Apply database migrations |
| `make migrate-create NAME=xxx` | Create new migration |
| `make css` | Build Tailwind CSS |
| `make css-watch` | Watch and rebuild CSS (separate terminal) |
| `make setup` | Install development tools |

## Project Structure

```
platinumapparel/
├── api/                    # Vercel serverless entry point
├── cmd/server/             # Main application entry point
│   ├── main.go             # Server initialization
│   └── slog.go             # Logging configuration
├── internal/
│   ├── config/             # Environment configuration
│   ├── ctxkeys/            # Context key types
│   ├── database/           # Database connection and sqlc
│   ├── handler/            # HTTP route handlers
│   ├── meta/               # SEO/meta helpers
│   ├── middleware/         # Echo middleware
│   └── services/
│       ├── clerk/          # Clerk authentication
│       └── stripe/         # Stripe payments
├── migrations/             # Goose SQL migrations
├── sqlc/
│   ├── queries/            # SQL query definitions
│   └── sqlc.yaml           # sqlc configuration
├── static/
│   ├── css/                # Tailwind CSS
│   └── js/                 # JavaScript
└── templates/
    ├── components/         # Reusable Templ components
    ├── layouts/            # Page layouts
    └── pages/              # Page templates
```

## Code Patterns

### Logging
Always use `slog`:
```go
slog.Info("message", "key", value)
slog.Error("failed to do thing", "error", err)
```
Never use `fmt.Printf` or `log.Printf`.

### Error Handling
Wrap errors with context:
```go
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
```

### Database Queries
Use sqlc-generated queries in `internal/database/sqlc/`:
```go
user, err := h.db.Queries.GetUserByClerkID(ctx, clerkID)
```

### Templates
Templates construct their own meta - handlers don't pass it:
```go
// In handler
return pages.Home().Render(c.Request().Context(), c.Response().Writer)

// In template
@layouts.Base(meta.New("Home", "Description")) {
    // content
}
```

### HTMX
Use HTMX attributes for dynamic content:
```html
<button hx-post="/cart/add" hx-vals='{"product_id": "1"}' hx-swap="none">
    Add to Cart
</button>
```

## Services

### Clerk Authentication
- Client-side: Clerk JS SDK loaded in base layout
- Server-side: `internal/services/clerk/clerk.go`
- Configure: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`

### Stripe Payments
- Checkout sessions via `/checkout/create-session`
- Webhooks via `/webhook/stripe`
- Configure: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

## Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. For SQLite: Use Turso or PlanetScale (SQLite mode)
4. Build command: `make build`
5. Output directory: `./`

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Dark) | `#050505` | Background |
| Secondary (Light) | `#f5f5f3` | Text |
| Accent (Gold) | `#d4b86f` | Highlights, buttons |
| Platinum | `#e5e4e2` | Accents |
| Muted | `#a8a8a2` | Secondary text |
