"use strict";

const db = require("../db");
const User = require("./user");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works with correct credentials", async function () {
    const user = await User.authenticate("testuser@email.com", "password");
    expect(user).toEqual({
      email: "testuser@email.com",
      firstName: "TestUser",
    });
  });

  test("throws UnauthorizedError with incorrect credentials", async function () {
    expect.assertions(1);
    try {
      await User.authenticate("testuser@email.com", "wrongpassword");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("throws UnauthorizedError if user not found", async function () {
    expect.assertions(1);
    try {
      await User.authenticate("nouser@email.com", "password");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    email: "newuser@email.com",
    firstName: "NewUser",
    password: "password",
  };

  test("works", async function () {
    const user = await User.register(newUser);
    expect(user).toEqual({
      email: "newuser@email.com",
      firstName: "NewUser",
    });

    const found = await db.query(
      `SELECT * FROM users WHERE email = 'newuser@email.com'`
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true); // Ensure hashed password
  });

  test("throws BadRequestError on duplicate email", async function () {
    expect.assertions(1);
    try {
      await User.register({
        email: "testuser@email.com",
        firstName: "TestUser",
        password: "password",
      });
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works with existing user", async function () {
    const user = await User.get("testuser@email.com");
    expect(user).toEqual({
      email: "testuser@email.com",
      firstName: "TestUser",
      favorite_teams: expect.any(Array),
      favorite_players: expect.any(Array),
    });
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.get("nouser@email.com");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "UpdatedUser",
    password: "newpassword",
  };

  test("works", async function () {
    const user = await User.update("testuser@email.com", updateData);
    expect(user).toEqual({
      email: "testuser@email.com",
      firstName: "UpdatedUser",
    });

    // Check password was hashed
    const found = await db.query(
      `SELECT * FROM users WHERE email = 'testuser@email.com'`
    );
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.update("nouser@email.com", updateData);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("testuser@email.com");
    const res = await db.query(
      `SELECT * FROM users WHERE email = 'testuser@email.com'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.remove("nouser@email.com");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** addFavoriteTeam */

describe("addFavoriteTeam", function () {
  test("works", async function () {
    const favoriteTeams = await User.addFavoriteTeam("testuser@email.com", 3);
    expect(favoriteTeams).toContain(1);
  });

  test("throws BadRequestError if team is already a favorite", async function () {
    expect.assertions(1);
    try {
      await User.addFavoriteTeam("testuser@email.com", 1);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.addFavoriteTeam("nouser@email.com", 4);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** removeFavoriteTeam */

describe("removeFavoriteTeam", function () {
  test("works", async function () {
    const favoriteTeams = await User.removeFavoriteTeam(
      "testuser@email.com",
      1
    );
    expect(favoriteTeams).not.toContain(1);
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.removeFavoriteTeam("nouser@email.com", 1);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** addFavoritePlayer */

describe("addFavoritePlayer", function () {
  test("works", async function () {
    const favoritePlayers = await User.addFavoritePlayer(
      "testuser@email.com",
      100
    );
    expect(favoritePlayers).toContain(100);
  });

  test("throws BadRequestError if player is already a favorite", async function () {
    expect.assertions(1);
    try {
      await User.addFavoritePlayer("testuser@email.com", 1);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.addFavoritePlayer("nouser@email.com", 100);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** removeFavoritePlayer */

describe("removeFavoritePlayer", function () {
  test("works", async function () {
    const favoritePlayers = await User.removeFavoritePlayer(
      "testuser@email.com",
      100
    );
    expect(favoritePlayers).not.toContain(100);
  });

  test("throws NotFoundError if no user", async function () {
    expect.assertions(1);
    try {
      await User.removeFavoritePlayer("nouser@email.com", 100);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
