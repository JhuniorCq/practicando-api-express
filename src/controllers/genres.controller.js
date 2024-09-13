import { GenresModel } from "../models/genres.model.js";

export class GenresController {
  static async getAll(req, res) {
    try {
      // Si hay Parámetros de Consulta hacemos su lógica
      const genres = await GenresModel.getAll();
      res.status(200).json(genres);
    } catch (error) {
      console.error("", error.message);
    }
  }
}
