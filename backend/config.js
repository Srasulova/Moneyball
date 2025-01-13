"use strict";

require("dotenv").config();
require("colors");

const PORT = process.env.PORT || 3001;
// const PORT = 3001;
const path = require("path");

function getDatabaseUri() {
  // Create absolute path to database file in the same directory as this file
  const dbPath = path.join(__dirname, "moneyball.db");
  return `sqlite:${dbPath}`;
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
