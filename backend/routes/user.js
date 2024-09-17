"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** GET /  => { user }
 *
 * Returns the current user's information.
 *
 * Authorization required: logged-in
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  // console.log(res.locals.user);
  try {
    const user = await User.get(res.locals.user.email);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /:email { user } => { user }
 *
 * Data can include:
 *   { firstName, password, email }
 *
 * Returns { firstName, email }
 *
 * Authorization required: same-user-as-:email
 **/

router.patch("/:email", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.email, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:email  =>  { deleted: email }
 *
 * Authorization required: same-user-as-:email
 **/

router.delete("/:email", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.email);
    return res.json({ deleted: req.params.email });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
