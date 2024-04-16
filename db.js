import pg from "pg";

const { Pool } = pg;

const config = {
  user: "postgres",
  host: "localhost",
  database: "repertorio",
  password: "1234",
  port: 5432,
};

export const pool = new Pool(config);