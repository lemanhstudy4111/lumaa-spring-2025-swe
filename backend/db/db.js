import pg from "pg";
import dotenv from "dotenv";

const dotenv = dotenv.config();
const processEnv = process.env;

//pool connection
const { Pool, Client } = pg;
const pool = new Pool({
  user: processEnv.POSTGRES_USER,
  password: processEnv.POSTGRES_PASSWORD,
  host: processEnv.POSTGRES_HOST,
  port: processEnv.POSTGRES_PORT,
  database: processEnv.POSTGRES_DB,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function query(text, params, callback) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
}
