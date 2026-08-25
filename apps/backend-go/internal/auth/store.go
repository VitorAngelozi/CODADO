package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrSessionNotFound    = errors.New("session not found")
)

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(ctx context.Context, databaseURL string) (*Store, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, err
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}

	if _, err := pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT now()
		);
		CREATE TABLE IF NOT EXISTS sessions (
			token_hash TEXT PRIMARY KEY,
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			expires_at TIMESTAMPTZ NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT now()
		);
		CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
		CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
	`); err != nil {
		pool.Close()
		return nil, err
	}

	return &Store{pool: pool}, nil
}

func (s *Store) Close() {
	s.pool.Close()
}

func (s *Store) CreateUser(ctx context.Context, name, email, password string) (User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, err
	}

	var user User
	err = s.pool.QueryRow(ctx, `
		INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id::text, name, email
	`, strings.TrimSpace(name), normalizeEmail(email), string(hash)).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil && strings.Contains(err.Error(), "duplicate key") {
		return User{}, ErrEmailAlreadyExists
	}
	return user, err
}

func (s *Store) Authenticate(ctx context.Context, email, password string) (User, error) {
	var user User
	var passwordHash string
	err := s.pool.QueryRow(ctx, `
		SELECT id::text, name, email, password_hash
		FROM users WHERE email = $1
	`, normalizeEmail(email)).Scan(&user.ID, &user.Name, &user.Email, &passwordHash)
	if errors.Is(err, pgx.ErrNoRows) || bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)) != nil {
		return User{}, ErrInvalidCredentials
	}
	return user, err
}

func (s *Store) CreateSession(ctx context.Context, userID string, duration time.Duration) (string, error) {
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(tokenBytes)
	_, err := s.pool.Exec(ctx, `
		INSERT INTO sessions (token_hash, user_id, expires_at)
		VALUES ($1, $2, $3)
	`, hashToken(token), userID, time.Now().Add(duration))
	return token, err
}

func (s *Store) UserBySession(ctx context.Context, token string) (User, error) {
	var user User
	err := s.pool.QueryRow(ctx, `
		SELECT u.id::text, u.name, u.email
		FROM sessions AS session
		JOIN users AS u ON u.id = session.user_id
		WHERE session.token_hash = $1 AND session.expires_at > now()
	`, hashToken(token)).Scan(&user.ID, &user.Name, &user.Email)
	if errors.Is(err, pgx.ErrNoRows) {
		return User{}, ErrSessionNotFound
	}
	return user, err
}

func (s *Store) DeleteSession(ctx context.Context, token string) error {
	_, err := s.pool.Exec(ctx, `DELETE FROM sessions WHERE token_hash = $1`, hashToken(token))
	return err
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func hashToken(token string) string {
	digest := sha256.Sum256([]byte(token))
	return hex.EncodeToString(digest[:])
}