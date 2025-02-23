import * as db from "../db/db.js";

export async function getTasks(req, res, next) {
  try {
    const userid = req.user.userid;
    const tasksData = await db.query(
      "SELECT id, title, description, iscomplete FROM tasks WHERE userid=$1",
      [userid]
    );
    return res.status(200).send({ status: "ok", data: tasksData.rows });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
    return err;
  }
}

export async function createTasks(req, res, next) {
  try {
    const userid = req.user.userid;
    const { title, description = "", isComplete = false } = req.body;
    const result = await db.query(
      "INSERT INTO tasks(userid, title, description, iscomplete) VALUES ($1, $2, $3, $4) RETURNING id, title, description, iscomplete;",
      [userid, title, description, isComplete]
    );
    return res.status(200).send({ status: "ok", data: result.rows[0] });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
    return err;
  }
}

export async function deleteTasks(req, res, next) {
  try {
    const tasksId = req.params.id;
    const result = await db.query("DELETE FROM tasks WHERE id=$1", [tasksId]);
    return res
      .status(200)
      .send({ status: "ok", data: "result " + result.rowCount });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
    return err;
  }
}

export async function updateTasks(req, res, next) {
  try {
    const taskId = req.params.id;
    const userid = req.user.userid;
    const { title, description, isComplete } = req.body;
    const result = await db.query(
      "UPDATE tasks SET title = $1, description = $2, isComplete = $3 WHERE id=$4 AND userid=$5 RETURNING id",
      [title, description, isComplete, taskId, userid]
    );
    return res.status(200).send({ status: "ok", data: result.rows });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: `Internal server error: ${err}` });
    return err;
  }
}
