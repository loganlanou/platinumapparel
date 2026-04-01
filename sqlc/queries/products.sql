-- name: GetProduct :one
SELECT * FROM products WHERE id = ? LIMIT 1;

-- name: GetProductBySlug :one
SELECT * FROM products WHERE slug = ? LIMIT 1;

-- name: ListProducts :many
SELECT * FROM products WHERE in_stock = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: ListProductsByCategory :many
SELECT * FROM products WHERE category = ? AND in_stock = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: ListProductsByCollection :many
SELECT * FROM products WHERE collection = ? AND in_stock = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: ListFeaturedProducts :many
SELECT * FROM products WHERE featured = 1 AND in_stock = 1 ORDER BY created_at DESC LIMIT ?;

-- name: SearchProducts :many
SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?) AND in_stock = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: CreateProduct :one
INSERT INTO products (name, slug, description, price, category, collection, image_url, featured)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateProduct :exec
UPDATE products SET name = ?, description = ?, price = ?, category = ?, collection = ?, image_url = ?, featured = ?, in_stock = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- name: DeleteProduct :exec
DELETE FROM products WHERE id = ?;

-- name: CountProducts :one
SELECT COUNT(*) FROM products WHERE in_stock = 1;

-- name: CountProductsByCategory :one
SELECT COUNT(*) FROM products WHERE category = ? AND in_stock = 1;
