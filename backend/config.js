"use strict";

require("dotenv").config();
require("colors");

const PORT = process.env.PORT || 3001;

function getDatabaseUri() {
  if (process.env.DATABASE_URL.includes("sqlite")) {
    const dbPath = process.env.DATABASE_URL.split(":")[1];
    console.log("SQLite database path:", dbPath);
    return dbPath;
  }
  console.log("Using non-SQLite database URL:", process.env.DATABASE_URL);
  return process.env.DATABASE_URL;
}

const SECRET_KEY = process.env.SECRET_KEY || "super-top-secret-key";

const BCRYPT_WORK_FACTOR = 12;

console.log("Moneyball Config:".green);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
