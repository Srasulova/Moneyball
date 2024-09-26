"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const PORT = process.env.PORT || 3001;

// Use database
function getDatabaseUri() {
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
