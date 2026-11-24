-- Run this once on a BoardBuddy database created before Google sign-in was added.
ALTER TABLE users
  MODIFY password_hash VARCHAR(255) NULL,
  ADD COLUMN google_id VARCHAR(255) NULL,
  ADD UNIQUE KEY uq_users_google_id (google_id),
  ADD CONSTRAINT chk_users_login_method CHECK (
    password_hash IS NOT NULL OR google_id IS NOT NULL
  );
