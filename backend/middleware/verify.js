import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyInput(req, res, next) {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing username or password" });
    }
    next();
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error. Error: " + err,
    });
    return err;
  }
}

export function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .send({ status: "error", message: "No Authorization Token" });
    }
    return jwt.verify(token, process.env.JWT_TOKEN, function (err, userid) {
      if (err) {
        return res
          .status(401)
          .send({ status: "error", message: "Invalid token" });
      }
      req.user = userid;
      next();
      return;
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Internal Server Error. Error at middleware: " + err,
    });
    return err;
  }
}
