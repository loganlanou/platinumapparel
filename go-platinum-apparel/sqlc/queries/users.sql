-- name: GetUserByClerkID :one
SELECT * FROM users WHERE clerk_id = ? LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = ? LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (clerk_id, email, first_name, last_name)
VALUES (?, ?, ?, ?)
RETURNING *;

-- name: UpdateUser :exec
UPDATE users SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
WHERE clerk_id = ?;
