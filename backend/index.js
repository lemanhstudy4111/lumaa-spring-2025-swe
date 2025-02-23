import express from "express";
import dotenv from "dotenv";
import { register, login } from "./routes/user.js";
import cors from "cors";
import { verifyInput, verifyJWT } from "./middleware/verify.js";
import { createTasks, deleteTasks, getTasks } from "./routes/tasks.js";

dotenv.config();
export const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/auth/register", verifyInput, register);
app.post("/auth/login", verifyInput, login);
app.get("/tasks", verifyJWT, getTasks);
app.post("/tasks", verifyJWT, createTasks);
app.delete("/tasks/:id", verifyJWT, deleteTasks)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
