import bcrypt from "bcrypt";
import * as db from "../db/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import app from "../index";

dotenv.config();

const saltRounds = 10;

export async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    //username already exists
    const existingUser = await db.query(
      "SELECT id FROM users WHERE username=$1;",
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ status: "error", message: "User already exists" });
    }
    //username and password valid
    return bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        throw new Error(err);
      }
      const userid = await db.query(
        "INSERT INTO users(username, password) VALUES($1, $2) RETURNING id;",
        [username, hash]
      );
      const token = jwt.sign({ userid: userid }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN * 60,
      });
      return res.status(200).json({
        status: "ok",
        data: token,
        message: "Successfully Register!",
      });
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
    return err;
  }
}

export async function login(req, res, next) {
  const { username, password } = req.body;
  try {
    //check if user exist
    const existingUser = await db.query(
      "SELECT id, password FROM users WHERE username=$1;",
      [username]
    );
    if (existingUser.rows.length < 1) {
      return res
        .status(404)
        .json({ status: "error", message: "User does not exists!" });
    }
    //check password valid
    return bcrypt.compare(
      password,
      existingUser.rows[0].password,
      function (err, result) {
        if (err) {
          throw new Error(err);
        }
        if (!result) {
          return res
            .status(401)
            .send({ status: "error", message: "Authentication failed" });
        }
        console.log("result " + result);
        const token = jwt.sign(
          { userid: existingUser.rows[0].id },
          process.env.JWT_TOKEN,
          {
            expiresIn: process.env.JWT_EXPIRES_IN * 60,
          }
        );
        return res.status(200).json({
          status: "ok",
          data: token,
          message: "Successfully Login!",
        });
      }
    );
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
    return err;
  }
}
