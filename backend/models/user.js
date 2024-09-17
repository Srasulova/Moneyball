"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
class User {
  /** Authenticate user with email, password. */
  static async authenticate(email, password) {
    const result = await db.query(
      `SELECT email,
                  password,
                  first_name AS "firstName"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register user with data. */
  static async register({ password, firstName, email }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (password, first_name, email)
           VALUES ($1, $2, $3)
           RETURNING first_name AS "firstName", email`,
      [hashedPassword, firstName, email]
    );

    return result.rows[0];
  }

  /** Get user by email including favorite teams and players. */
  static async get(email) {
    const userRes = await db.query(
      `SELECT email, first_name AS "firstName", favorite_teams, favorite_players
     FROM users
     WHERE email = $1`,
      [email]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    return user;
  }

  /** Update user data. */
  static async update(email, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
    });

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE email = $${values.length + 1} 
                      RETURNING first_name AS "firstName", email`;
    const result = await db.query(querySql, [...values, email]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    delete user.password;
    return user;
  }

  /** Delete user from database. */
  static async remove(email) {
    const result = await db.query(
      `DELETE
           FROM users
           WHERE email = $1
           RETURNING email`,
      [email]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user found with email: ${email}`);
  }

  /** Add team to user's favorites. */
  static async addFavoriteTeam(email, teamId) {
    const userRes = await db.query(
      `SELECT favorite_teams
     FROM users
     WHERE email = $1`,
      [email]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    // Check if teamId is already in the favorites array
    if (user.favorite_teams.includes(teamId)) {
      throw new BadRequestError(`Team ID: ${teamId} is already a favorite.`);
    }

    const result = await db.query(
      `UPDATE users
     SET favorite_teams = array_append(favorite_teams, $1)
     WHERE email = $2
     RETURNING favorite_teams`,
      [teamId, email]
    );

    return result.rows[0].favorite_teams;
  }

  /** Remove team from user's favorites. */
  static async removeFavoriteTeam(email, teamId) {
    const result = await db.query(
      `UPDATE users
     SET favorite_teams = array_remove(favorite_teams, $1)
     WHERE email = $2
     RETURNING favorite_teams`,
      [teamId, email]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    return user.favorite_teams;
  }

  /** Add player to user's favorites. */
  static async addFavoritePlayer(email, playerId) {
    const userRes = await db.query(
      `SELECT favorite_players
     FROM users
     WHERE email = $1`,
      [email]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    // Check if playerId is already in the favorites array
    if (user.favorite_players && user.favorite_players.includes(playerId)) {
      throw new BadRequestError(
        `Player ID: ${playerId} is already a favorite.`
      );
    }

    const result = await db.query(
      `UPDATE users
     SET favorite_players = array_append(favorite_players, $1)
     WHERE email = $2
     RETURNING favorite_players`,
      [playerId, email]
    );

    return result.rows[0].favorite_players;
  }

  /** Remove player from user's favorites. */
  static async removeFavoritePlayer(email, playerId) {
    const result = await db.query(
      `UPDATE users
     SET favorite_players = array_remove(favorite_players, $1)
     WHERE email = $2
     RETURNING favorite_players`,
      [playerId, email]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    return user.favorite_players;
  }

  /** Get favorite teams of a user. */
  static async getFavoriteTeams(email) {
    const result = await db.query(
      `SELECT favorite_teams
     FROM users
     WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    return user.favorite_teams || [];
  }

  /** Get favorite players of a user. */
  static async getFavoritePlayers(email) {
    const result = await db.query(
      `SELECT favorite_players
     FROM users
     WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user found with email: ${email}`);

    return user.favorite_players || [];
  }
}

module.exports = User;
