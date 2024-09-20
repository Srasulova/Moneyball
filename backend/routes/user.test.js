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

/************************************** GET /users */

describe("GET /user", function () {
  test("works for logged-in user", async function () {
    const resp = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      user: {
        email: "user1@user.com",
        firstName: "U1F",
        favorite_players: null,
        favorite_teams: null,
      },
    });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).get("/user");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/:email */

describe("PATCH /user/:email", function () {
  test("works for logged-in user updating own info", async function () {
    const resp = await request(app)
      .patch("/user/user1@user.com")
      .set("Authorization", `Bearer ${u1Token}`)
      .send({
        firstName: "UpdatedUser1",
        password: "newpassword",
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      user: {
        email: "user1@user.com",
        firstName: "UpdatedUser1",
      },
    });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).patch("/user/user1@user.com").send({
      firstName: "UpdatedUser1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for user trying to update another user's info", async function () {
    const resp = await request(app)
      .patch("/user/user2@user.com")
      .set("Authorization", `Bearer ${u1Token}`)
      .send({
        firstName: "MaliciousUser",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .patch("/user/user1@user.com")
      .set("Authorization", `Bearer ${u1Token}`)
      .send({
        email: "not-an-email",
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:email */

describe("DELETE /user/:email", function () {
  test("works for logged-in user deleting own account", async function () {
    const resp = await request(app)
      .delete("/user/user1@user.com")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ deleted: "user1@user.com" });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).delete("/user/user1@user.com");
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for user trying to delete another user's account", async function () {
    const resp = await request(app)
      .delete("/user/user2@user.com")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
