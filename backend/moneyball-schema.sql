-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   password TEXT NOT NULL,
--   first_name TEXT NOT NULL,
--   email TEXT NOT NULL UNIQUE
--     CHECK (position('@' in email) > 1),
--   favorite_teams INTEGER[],  
--   favorite_players INTEGER[] 
-- );


CREATE TABLE users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
  CHECK(instr(email, '@') > 1), 
  favorite_teams TEXT,  
  favorite_players TEXT 
)