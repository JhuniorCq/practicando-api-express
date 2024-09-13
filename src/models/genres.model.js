import { pool } from "../config/db.js";

export class GenresModel {
  static async getAll() {
    try {
      const [genres] = await pool.query("SELECT name FROM genre");
      return genres;
    } catch (error) {
      console.error("Error en getAll en genres.model.js", error.message);
    }
  }
}
