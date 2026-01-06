-- name: GetOrder :one
SELECT * FROM orders WHERE id = ? LIMIT 1;

-- name: GetOrderByPaymentIntent :one
SELECT * FROM orders WHERE stripe_payment_intent_id = ? LIMIT 1;

-- name: ListUserOrders :many
SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?;

-- name: CreateOrder :one
INSERT INTO orders (user_id, stripe_payment_intent_id, status, total, shipping_address)
VALUES (?, ?, ?, ?, ?)
RETURNING *;

-- name: UpdateOrderStatus :exec
UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;

-- name: UpdateOrderPaymentIntent :exec
UPDATE orders SET stripe_payment_intent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;

-- name: GetOrderItems :many
SELECT oi.*, p.name as product_name, p.image_url as product_image
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = ?;

-- name: CreateOrderItem :one
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (?, ?, ?, ?)
RETURNING *;
