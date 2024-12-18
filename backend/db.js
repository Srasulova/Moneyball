"use strict";
/** Database setup. */
// const { Client } = require("pg");
const sqlite3 = require("sqlite3").verbose();
const { getDatabaseUri } = require("./config");

const dbPath = getDatabaseUri();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database:", dbPath);
  }
});

module.exports = db;
