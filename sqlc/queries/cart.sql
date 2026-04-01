-- name: GetCartItems :many
SELECT ci.*, p.name as product_name, p.price as product_price, p.image_url as product_image
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = ?;

-- name: GetCartItem :one
SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1;

-- name: AddToCart :one
INSERT INTO cart_items (user_id, product_id, quantity)
VALUES (?, ?, ?)
ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + excluded.quantity
RETURNING *;

-- name: UpdateCartItemQuantity :exec
UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?;

-- name: RemoveFromCart :exec
DELETE FROM cart_items WHERE user_id = ? AND product_id = ?;

-- name: ClearCart :exec
DELETE FROM cart_items WHERE user_id = ?;

-- name: GetCartTotal :one
SELECT COALESCE(SUM(ci.quantity * p.price), 0) as total
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = ?;

-- name: GetCartItemCount :one
SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = ?;
