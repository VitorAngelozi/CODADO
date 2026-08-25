-- CODADO: schema relacional PostgreSQL.
-- Este script e idempotente e preserva users/sessions criadas pelo backend.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CONSTRAINT users_name_not_blank CHECK (length(trim(name)) > 0),
    email TEXT NOT NULL UNIQUE CONSTRAINT users_email_format CHECK (position('@' IN email) > 1),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY CONSTRAINT sessions_token_hash_length CHECK (length(token_hash) = 64),
    user_id UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT sessions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_name_not_blank') THEN
        ALTER TABLE users ADD CONSTRAINT users_name_not_blank CHECK (length(trim(name)) > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_format') THEN
        ALTER TABLE users ADD CONSTRAINT users_email_format CHECK (position('@' IN email) > 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_token_hash_length') THEN
        ALTER TABLE sessions ADD CONSTRAINT sessions_token_hash_length CHECK (length(token_hash) = 64);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    challenge_type TEXT NOT NULL CHECK (challenge_type IN ('quiz', 'bug_hunt', 'language')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'hardcore', 'survival')),
    statement TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1 CHECK (points > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT challenges_track_id_fkey
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS challenges_track_id_idx ON challenges(track_id);

CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    challenge_id UUID NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'timeout', 'runtime_error')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT attempts_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT attempts_challenge_id_fkey
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS attempts_user_id_idx ON attempts(user_id);
CREATE INDEX IF NOT EXISTS attempts_challenge_id_idx ON attempts(challenge_id);
CREATE INDEX IF NOT EXISTS attempts_score_idx ON attempts(score DESC);