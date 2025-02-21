import bcrypt from "bcrypt";
import * as db from "../db/db";
import app from "../index";

const saltRounds = 10;

function register(req, res, next) {
  const { username, password } = req.body;
  try {
    //no username or password
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing username or password" });
    }
    //username already exists
    const existingUser = db.query(`SELECT id FROM users WHERE username='$1';`, [
      username,
    ]);
    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ status: "error", message: "User already exists" });
    }
    //username and password valid
    const result = bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        return res
          .status(500)
          .json({ status: "error", message: "Error while hashing" });
      }
      return db.query(
        "INSERT INTO users(username, password) VALUES($1, $2) RETURNING id;",
        [username, hash]
      );
    });
    return res
      .status(200)
      .json({ status: "ok", message: "Successfully Register!" });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
  }
}

function login(req, res, next) {
  const { username, password } = req.body;
  try {
    //invalid logins
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing username or password" });
    }
    //check if user exist
    const existingUser = db.query(
      `SELECT password FROM users WHERE username='$1';`,
      [username]
    );
    if (existingUser.rows.length < 1) {
      return res
        .status(404)
        .json({ status: "error", message: "User does not exists!" });
    }
    //check password valid
    const result = bcrypt.compare();
    //JWT token
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
  }
}
