"use strict";

/** Routes for favorite teams and players. */

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

/** GET /favorites/teams  => { favoriteTeams }
 *
 * Returns the current user's favorite teams.
 *
 * Authorization required: logged-in
 **/
router.get("/teams", ensureLoggedIn, async function (req, res, next) {
  try {
    const favoriteTeams = await User.getFavoriteTeams(res.locals.user.email);
    return res.json({ favoriteTeams });
  } catch (err) {
    return next(err);
  }
});

/** GET /favorites/players  => { favoritePlayers }
 *
 * Returns the current user's favorite players.
 *
 * Authorization required: logged-in
 **/
router.get("/players", ensureLoggedIn, async function (req, res, next) {
  try {
    const favoritePlayers = await User.getFavoritePlayers(
      res.locals.user.email
    );
    return res.json({ favoritePlayers });
  } catch (err) {
    return next(err);
  }
});

/** POST /favorites/teams/:teamId  => { favoriteTeams }
 *
 * Adds a team to the current user's favorites.
 *
 * Authorization required: logged-in
 **/
router.post("/teams/:teamId", ensureLoggedIn, async function (req, res, next) {
  try {
    const { teamId } = req.params;
    const favoriteTeams = await User.addFavoriteTeam(
      res.locals.user.email,
      teamId
    );
    return res.json({ favoriteTeams });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /favorites/teams/:teamId  => { favoriteTeams }
 *
 * Removes a team from the current user's favorites.
 *
 * Authorization required: logged-in
 **/
router.delete(
  "/teams/:teamId",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { teamId } = req.params;
      const favoriteTeams = await User.removeFavoriteTeam(
        res.locals.user.email,
        teamId
      );
      return res.json({ favoriteTeams });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /favorites/players/:playerId  => { favoritePlayers }
 *
 * Adds a player to the current user's favorites.
 *
 * Authorization required: logged-in
 **/
router.post(
  "/players/:playerId",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { playerId } = req.params;
      const favoritePlayers = await User.addFavoritePlayer(
        res.locals.user.email,
        playerId
      );
      return res.json({ favoritePlayers });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /favorites/players/:playerId  => { favoritePlayers }
 *
 * Removes a player from the current user's favorites.
 *
 * Authorization required: logged-in
 **/
router.delete(
  "/players/:playerId",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { playerId } = req.params;
      const favoritePlayers = await User.removeFavoritePlayer(
        res.locals.user.email,
        playerId
      );
      return res.json({ favoritePlayers });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
