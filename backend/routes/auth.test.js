"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/login */

describe("POST /auth/login", function () {
  test("works", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "user1@user.com",
      password: "password1",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });

    // Check that the token matches u1Token
    expect(resp.body.token).toEqual(u1Token);
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "no-such-user@user.com",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "user1@user.com",
      password: "wrong-password",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "user1@user.com",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/login").send({
      email: "not-an-email",
      password: "password",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works", async function () {
    const resp = await request(app).post("/auth/register").send({
      firstName: "New",
      email: "new@user.com",
      password: "password",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });

    // Check that the token is different from u1Token and u2Token
    expect(resp.body.token).not.toEqual(u1Token);
    expect(resp.body.token).not.toEqual(u2Token);
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      firstName: "New",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid email", async function () {
    const resp = await request(app).post("/auth/register").send({
      firstName: "New",
      email: "not-an-email",
      password: "password",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
