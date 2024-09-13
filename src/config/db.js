import mysql from "mysql2/promise";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE,
} from "./config.js";

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
  // connectionLimit: 10 -> Si no se especifica, por defecto será 10
};

export const pool = mysql.createPool(config);
