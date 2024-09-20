const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUserEmails = [];
const testFavoriteTeamIds = [1, 2]; // Test teams IDs
const testFavoritePlayerIds = [1, 2]; // Test players IDs

async function commonBeforeAll() {
  // Clean up any existing data
  await db.query("DELETE FROM users");

  // Insert test data for users with a single password
  const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);

  const resultUsers = await db.query(
    `
    INSERT INTO users (email, password, first_name, favorite_teams, favorite_players)
    VALUES ('testuser@email.com', $1, 'TestUser', $2, $3)
    RETURNING email`,
    [hashedPassword, testFavoriteTeamIds, testFavoritePlayerIds]
  );

  testUserEmails.splice(0, 0, ...resultUsers.rows.map((r) => r.email));
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserEmails,
  testFavoriteTeamIds,
  testFavoritePlayerIds,
};
