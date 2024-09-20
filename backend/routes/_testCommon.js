"use strict";

const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const testUserIds = [];

async function commonBeforeAll() {
  // Clean up the database
  await db.query("DELETE FROM users");

  // Create test users
  const user1 = await User.register({
    firstName: "U1F",
    email: "user1@user.com",
    password: "password1",
    favoriteTeams: [],
    favoritePlayers: [],
  });
  testUserIds[0] = user1.id;

  const user2 = await User.register({
    firstName: "U2F",
    email: "user2@user.com",
    password: "password2",
    favoriteTeams: [],
    favoritePlayers: [],
  });
  testUserIds[1] = user2.id;
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

// Create test tokens
const u1Token = createToken({ email: "user1@user.com" });
const u2Token = createToken({ email: "user2@user.com" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  u1Token,
  u2Token,
};
