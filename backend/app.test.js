"use strict";

const request = require("supertest");
const app = require("./app");
const db = require("./db");
const User = require("./models/user");

beforeAll(async () => {
  // Clear test database if needed
  await db.query("DELETE FROM users WHERE email = 'test@test.com'");

  // Create a test user with a first name
  await User.register({
    email: "test@test.com",
    password: "password",
    first_name: "Test", // Ensure first_name is provided
  });
});

afterAll(async () => {
  await db.query("DELETE FROM users WHERE email = 'test@test.com'");
  await db.end();
});

describe("Auth Routes", function () {
  test("POST /auth/token - generates token", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({ email: "test@test.com", password: "password" });

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      token: expect.any(String), // Expect a token to be returned
    });
  });
});

describe("User Routes", function () {
  let token;

  beforeAll(async () => {
    const resp = await request(app)
      .post("/auth/token")
      .send({ email: "test@test.com", password: "password" });
    token = resp.body.token; // Store the token for use in subsequent tests
  });

  test("GET /user/test@test.com - get user details", async function () {
    const resp = await request(app)
      .get("/user/test@test.com")
      .set("Authorization", `Bearer ${token}`); // Pass token in the header

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      user: expect.any(Object), // Expect user object
    });
  });
});

describe("Favorites Routes", function () {
  let token;

  beforeAll(async () => {
    const resp = await request(app)
      .post("/auth/token")
      .send({ email: "test@test.com", password: "password" });
    token = resp.body.token; // Store the token for use in subsequent tests
  });

  test("GET /favorites/teams - get favorite teams", async function () {
    const resp = await request(app)
      .get("/favorites/teams")
      .set("Authorization", `Bearer ${token}`); // Pass token in the header

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      favoriteTeams: expect.any(Array), // Expect an array of favorite teams
    });
  });
});

describe("404 Not Found", function () {
  test("not found for site 404", async function () {
    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);
  });
});
