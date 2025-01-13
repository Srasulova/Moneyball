"use strict";
const sqlite3 = require("sqlite3").verbose();
const { getDatabaseUri } = require("./config");
const fs = require("fs");
const path = require("path");

const dbPath = getDatabaseUri();
console.log("Absolute database path:", path.resolve(dbPath));
console.log("Current working directory:", process.cwd());

const schemaSQL = fs.readFileSync(
  path.join(__dirname, "moneyball.sql"),
  "utf8"
);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database:", dbPath);

  // Initialize database schema
  db.exec(schemaSQL, (err) => {
    if (err) {
      console.error("Error initializing database schema:", err.message);
    } else {
      console.log("Database schema initialized successfully");

      // Verify the users table
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
        (err, row) => {
          if (err) {
            console.error("Error checking users table:", err.message);
          } else if (!row) {
            console.error("Users table was not created!");
          } else {
            console.log("Users table exists and is ready");
          }
        }
      );
    }
  });
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

// Check current data in users table
db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) {
    console.error("Error querying users:", err.message);
  } else {
    console.log("All users in database:", rows);
  }
});

module.exports = db;
