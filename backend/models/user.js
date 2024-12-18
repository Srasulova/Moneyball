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
    // Query the database for the user by email
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT email, password, first_name AS "firstName" FROM users WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        // Remove the password from the user object before returning it
        delete user.password;
        return user;
      }
    }

    // If no user or invalid password, throw an UnauthorizedError
    throw new UnauthorizedError("Invalid email/password");
  }

  // static async authenticate(email, password) {
  //   const result = await db.query(
  //     `SELECT email,
  //                 password,
  //                 first_name AS "firstName"
  //          FROM users
  //          WHERE email = $1`,
  //     [email]
  //   );

  //   const user = result.rows[0];

  //   if (user) {
  //     const isValid = await bcrypt.compare(password, user.password);
  //     if (isValid === true) {
  //       delete user.password;
  //       return user;
  //     }
  //   }

  //   throw new UnauthorizedError("Invalid email/password");
  // }

  /** Register user with data. */
  static async register({ password, firstName, email }) {
    // Duplicate check
    const duplicateCheck = await new Promise((resolve, reject) => {
      db.get(`SELECT email FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (duplicateCheck) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Insert the new user into the database
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (password, first_name, email) VALUES (?, ?, ?)`,
        [hashedPassword, firstName, email],
        function (err) {
          if (err) return reject(err);
          resolve(this);
        }
      );
    });

    // Return user data after insertion
    return { firstName, email };
  }

  /** Register user with data. */
  // static async register({ password, firstName, email }) {
  //   const duplicateCheck = await db.query(
  //     `SELECT email
  //          FROM users
  //          WHERE email = $1`,
  //     [email]
  //   );

  //   if (duplicateCheck.rows[0]) {
  //     throw new BadRequestError(`Duplicate email: ${email}`);
  //   }

  //   const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  //   const result = await db.query(
  //     `INSERT INTO users
  //          (password, first_name, email)
  //          VALUES ($1, $2, $3)
  //          RETURNING first_name AS "firstName", email`,
  //     [hashedPassword, firstName, email]
  //   );

  //   return result.rows[0];
  // }

  /** Get user by email including favorite teams and players. */
  static async get(email) {
    // Query the database for the user by email
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT email, first_name AS "firstName", favorite_teams, favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    // If no user is found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError(`No user found with email: ${email}`);
    }

    return user;
  }

  /** Get user by email including favorite teams and players. */
  // static async get(email) {
  //   const userRes = await db.query(
  //     `SELECT email, first_name AS "firstName", favorite_teams, favorite_players
  //    FROM users
  //    WHERE email = $1`,
  //     [email]
  //   );

  //   const user = userRes.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   return user;
  // }

  /** Update user data. */
  static async update(email, data) {
    if (data.password) {
      // If there's a password, hash it before updating
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    // Use sqlForPartialUpdate to construct SET clauses and values
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
    });

    // SQLite does not support RETURNING, so we will first update the user
    const updateSql = `UPDATE users 
                     SET ${setCols} 
                     WHERE email = ?`;

    // Perform the update
    await new Promise((resolve, reject) => {
      db.run(updateSql, [...values, email], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });

    // Now, retrieve the updated user data
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT email, first_name AS "firstName", favorite_teams, favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    // If no user found after update, throw NotFoundError
    if (!user) {
      throw new NotFoundError(`No user found with email: ${email}`);
    }

    // Remove password from the returned user object
    delete user.password;
    return user;
  }

  /** Update user data. */
  // static async update(email, data) {
  //   if (data.password) {
  //     data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  //   }

  //   const { setCols, values } = sqlForPartialUpdate(data, {
  //     firstName: "first_name",
  //   });

  //   const querySql = `UPDATE users
  //                     SET ${setCols}
  //                     WHERE email = $${values.length + 1}
  //                     RETURNING first_name AS "firstName", email`;
  //   const result = await db.query(querySql, [...values, email]);
  //   const user = result.rows[0];

  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   delete user.password;
  //   return user;
  // }

  /** Delete user from database. */
  // static async remove(email) {
  //   const result = await db.query(
  //     `DELETE
  //          FROM users
  //          WHERE email = $1
  //          RETURNING email`,
  //     [email]
  //   );
  //   const user = result.rows[0];

  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);
  // }

  /** Delete user from database. */
  static async remove(email) {
    const deleteSql = `DELETE
                     FROM users
                     WHERE email = ?`;

    // Execute deletion
    await new Promise((resolve, reject) => {
      db.run(deleteSql, [email], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });

    // Check if the user was actually deleted
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT email
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!user) throw new NotFoundError(`No user found with email: ${email}`);
  }

  /** Add team to user's favorites. */
  // static async addFavoriteTeam(email, teamId) {
  //   const userRes = await db.query(
  //     `SELECT favorite_teams
  //      FROM users
  //      WHERE email = $1`,
  //     [email]
  //   );

  //   const user = userRes.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   let favoriteTeams = user.favorite_teams
  //     ? JSON.parse(user.favorite_teams)
  //     : [];
  //   if (favoriteTeams.includes(teamId)) {
  //     throw new BadRequestError(`Team ID: ${teamId} is already a favorite.`);
  //   }

  //   favoriteTeams.push(teamId);

  //   const result = await db.query(
  //     `UPDATE users
  //      SET favorite_teams = $1
  //      WHERE email = $2
  //      RETURNING favorite_teams`,
  //     [JSON.stringify(favoriteTeams), email]
  //   );

  //   return JSON.parse(result.rows[0].favorite_teams);
  // }

  /** Add team to user's favorites. */
  static async addFavoriteTeam(email, teamId) {
    const userRes = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_teams
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!userRes) throw new NotFoundError(`No user found with email: ${email}`);

    let favoriteTeams = userRes.favorite_teams
      ? JSON.parse(userRes.favorite_teams)
      : [];
    if (favoriteTeams.includes(teamId)) {
      throw new BadRequestError(`Team ID: ${teamId} is already a favorite.`);
    }

    favoriteTeams.push(teamId);

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users
       SET favorite_teams = ?
       WHERE email = ?`,
        [JSON.stringify(favoriteTeams), email],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // Retrieve the updated favorite teams
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_teams
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    return updatedUser.favorite_teams
      ? JSON.parse(updatedUser.favorite_teams)
      : [];
  }

  /** Remove team from user's favorites. */
  // static async removeFavoriteTeam(email, teamId) {
  //   const userRes = await db.query(
  //     `SELECT favorite_teams
  //      FROM users
  //      WHERE email = $1`,
  //     [email]
  //   );

  //   const user = userRes.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   let favoriteTeams = user.favorite_teams
  //     ? JSON.parse(user.favorite_teams)
  //     : [];
  //   favoriteTeams = favoriteTeams.filter((id) => id !== teamId);

  //   const result = await db.query(
  //     `UPDATE users
  //      SET favorite_teams = $1
  //      WHERE email = $2
  //      RETURNING favorite_teams`,
  //     [JSON.stringify(favoriteTeams), email]
  //   );

  //   return JSON.parse(result.rows[0].favorite_teams);
  // }

  /** Remove team from user's favorites. */
  static async removeFavoriteTeam(email, teamId) {
    const userRes = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_teams
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!userRes) throw new NotFoundError(`No user found with email: ${email}`);

    let favoriteTeams = userRes.favorite_teams
      ? JSON.parse(userRes.favorite_teams)
      : [];
    favoriteTeams = favoriteTeams.filter((id) => id !== teamId);

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users
       SET favorite_teams = ?
       WHERE email = ?`,
        [JSON.stringify(favoriteTeams), email],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // Retrieve the updated favorite teams
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_teams
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    return updatedUser.favorite_teams
      ? JSON.parse(updatedUser.favorite_teams)
      : [];
  }

  /** Add player to user's favorites. */
  // static async addFavoritePlayer(email, playerId) {
  //   const userRes = await db.query(
  //     `SELECT favorite_players
  //      FROM users
  //      WHERE email = $1`,
  //     [email]
  //   );

  //   const user = userRes.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   let favoritePlayers = user.favorite_players
  //     ? JSON.parse(user.favorite_players)
  //     : [];
  //   if (favoritePlayers.includes(playerId)) {
  //     throw new BadRequestError(
  //       `Player ID: ${playerId} is already a favorite.`
  //     );
  //   }

  //   favoritePlayers.push(playerId);

  //   const result = await db.query(
  //     `UPDATE users
  //      SET favorite_players = $1
  //      WHERE email = $2
  //      RETURNING favorite_players`,
  //     [JSON.stringify(favoritePlayers), email]
  //   );

  //   return JSON.parse(result.rows[0].favorite_players);
  // }

  // /** Remove player from user's favorites. */
  // static async removeFavoritePlayer(email, playerId) {
  //   const userRes = await db.query(
  //     `SELECT favorite_players
  //      FROM users
  //      WHERE email = $1`,
  //     [email]
  //   );

  //   const user = userRes.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   let favoritePlayers = user.favorite_players
  //     ? JSON.parse(user.favorite_players)
  //     : [];
  //   favoritePlayers = favoritePlayers.filter((id) => id !== playerId);

  //   const result = await db.query(
  //     `UPDATE users
  //      SET favorite_players = $1
  //      WHERE email = $2
  //      RETURNING favorite_players`,
  //     [JSON.stringify(favoritePlayers), email]
  //   );

  //   return JSON.parse(result.rows[0].favorite_players);
  // }

  /** Add player to user's favorites. */
  static async addFavoritePlayer(email, playerId) {
    const userRes = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!userRes) throw new NotFoundError(`No user found with email: ${email}`);

    let favoritePlayers = userRes.favorite_players
      ? JSON.parse(userRes.favorite_players)
      : [];
    if (favoritePlayers.includes(playerId)) {
      throw new BadRequestError(
        `Player ID: ${playerId} is already a favorite.`
      );
    }

    favoritePlayers.push(playerId);

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users
       SET favorite_players = ?
       WHERE email = ?`,
        [JSON.stringify(favoritePlayers), email],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // Retrieve the updated favorite players
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    return updatedUser.favorite_players
      ? JSON.parse(updatedUser.favorite_players)
      : [];
  }

  /** Remove player from user's favorites. */
  static async removeFavoritePlayer(email, playerId) {
    const userRes = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!userRes) throw new NotFoundError(`No user found with email: ${email}`);

    let favoritePlayers = userRes.favorite_players
      ? JSON.parse(userRes.favorite_players)
      : [];
    favoritePlayers = favoritePlayers.filter((id) => id !== playerId);

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users
       SET favorite_players = ?
       WHERE email = ?`,
        [JSON.stringify(favoritePlayers), email],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // Retrieve the updated favorite players
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    return updatedUser.favorite_players
      ? JSON.parse(updatedUser.favorite_players)
      : [];
  }

  /** Get favorite teams of a user. */
  // static async getFavoriteTeams(email) {
  //   const result = await db.query(
  //     `SELECT favorite_teams
  //      FROM users
  //      WHERE email = $1`,
  //     [email]
  //   );

  //   const user = result.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   return user.favorite_teams ? JSON.parse(user.favorite_teams) : [];
  // }

  /** Get favorite teams of a user. */
  static async getFavoriteTeams(email) {
    const result = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_teams
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!result) throw new NotFoundError(`No user found with email: ${email}`);

    return result.favorite_teams ? JSON.parse(result.favorite_teams) : [];
  }

  /** Get favorite players of a user. */
  // static async getFavoritePlayers(email) {
  //   const result = await db.query(
  //     `SELECT favorite_players
  //      FROM users
  //      WHERE email = $1`,
  //     [email]
  //   );

  //   const user = result.rows[0];
  //   if (!user) throw new NotFoundError(`No user found with email: ${email}`);

  //   return user.favorite_players ? JSON.parse(user.favorite_players) : [];
  // }

  /** Get favorite players of a user. */
  static async getFavoritePlayers(email) {
    const result = await new Promise((resolve, reject) => {
      db.get(
        `SELECT favorite_players
       FROM users
       WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!result) throw new NotFoundError(`No user found with email: ${email}`);

    return result.favorite_players ? JSON.parse(result.favorite_players) : [];
  }
}

module.exports = User;
