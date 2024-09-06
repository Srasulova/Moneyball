CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
    CHECK (position('@' in email) > 1),
  favorite_teams INTEGER[],  
  favorite_players INTEGER[] 
);
