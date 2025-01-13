-- \echo 'Delete and recreate moneyball db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE moneyball;
-- CREATE DATABASE moneyball;
-- \connect moneyball

-- \i moneyball-schema.sql

-- \echo 'Delete and recreate moneyball_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE moneyball_test;
-- CREATE DATABASE moneyball_test;
-- \connect moneyball_test

-- \i moneyball-schema.sql



-- SQLite initialization file
PRAGMA foreign_keys = ON;

-- Create the tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
  CHECK(instr(email, '@') > 1),
  favorite_teams TEXT,
  favorite_players TEXT
);