import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE,
} from "./config.js";

import mysql from "mysql2/promise";

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
  // connectionLimit: 10 -> Si no se especifica, por defecto será 10
};

const pool = mysql.createPool(config);

// Verificar la Conexión a la BD
const verifyConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Obtener una conexión
    console.log("Conexión exitosa a la Base de Datos.");
    connection.release(); // Liberar la conexión y devolverla al pool
  } catch (error) {
    console.error("Error en la conexión a la Base de Datos", error.stack);
  }
};

// Ejecutamos la verificación
verifyConnection();

export { pool };
