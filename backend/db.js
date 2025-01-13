"use strict";
/** Database setup. */
// const { Client } = require("pg");
const sqlite3 = require("sqlite3").verbose();
const { getDatabaseUri } = require("./config");

const dbPath = getDatabaseUri();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
    process.exit(1); // Exit if we can't connect to the database
  }
  console.log("Connected to SQLite database:", dbPath);

  // Verify the database setup by checking the users table
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    (err, row) => {
      if (err) {
        console.error("Error checking users table:", err.message);
      } else if (!row) {
        console.error("Users table does not exist!");
      } else {
        console.log("Users table exists");
        // Test query to check users
        db.all("SELECT * FROM users", [], (err, rows) => {
          if (err) {
            console.error("Error querying users:", err.message);
          } else {
            console.log("Current users in database:", rows);
          }
        });
      }
    }
  );
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

module.exports = db;
