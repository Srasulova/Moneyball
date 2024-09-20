"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /favorites/teams */

describe("GET /favorites/teams", function () {
  test("works for logged-in user", async function () {
    const resp = await request(app)
      .get("/favorites/teams")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      favoriteTeams: expect.any(Array),
    });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).get("/favorites/teams");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /favorites/players */

describe("GET /favorites/players", function () {
  test("works for logged-in user", async function () {
    const resp = await request(app)
      .get("/favorites/players")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      favoritePlayers: expect.any(Array),
    });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).get("/favorites/players");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST /favorites/teams/:teamId */

describe("POST /favorites/teams/:teamId", function () {
  test("works for logged-in user", async function () {
    const teamId = "1";
    const resp = await request(app)
      .post(`/favorites/teams/${teamId}`)
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      favoriteTeams: expect.any(Array),
    });
  });

  test("unauth for non-logged in user", async function () {
    const teamId = "1";
    const resp = await request(app).post(`/favorites/teams/${teamId}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /favorites/teams/:teamId */

describe("DELETE /favorites/teams/:teamId", function () {
  test("works for logged-in user", async function () {
    const teamId = "1";
    const resp = await request(app)
      .delete(`/favorites/teams/${teamId}`)
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);

    // Check if favoriteTeams is either an array or null
    expect(
      resp.body.favoriteTeams === null || Array.isArray(resp.body.favoriteTeams)
    ).toBe(true);
  });

  test("unauth for non-logged in user", async function () {
    const teamId = "1";
    const resp = await request(app).delete(`/favorites/teams/${teamId}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST /favorites/players/:playerId */

describe("POST /favorites/players/:playerId", function () {
  test("works for logged-in user", async function () {
    const playerId = "1";
    const resp = await request(app)
      .post(`/favorites/players/${playerId}`)
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      favoritePlayers: expect.any(Array),
    });
  });

  test("unauth for non-logged in user", async function () {
    const playerId = "1";
    const resp = await request(app).post(`/favorites/players/${playerId}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /favorites/players/:playerId */

describe("DELETE /favorites/players/:playerId", function () {
  test("works for logged-in user", async function () {
    const playerId = "1";
    const resp = await request(app)
      .delete(`/favorites/players/${playerId}`)
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);

    // Check if favoritePlayers is either an array or null
    expect(
      resp.body.favoritePlayers === null ||
        Array.isArray(resp.body.favoritePlayers)
    ).toBe(true);
  });

  test("unauth for non-logged in user", async function () {
    const playerId = "1";
    const resp = await request(app).delete(`/favorites/players/${playerId}`);
    expect(resp.statusCode).toEqual(401);
  });
});
