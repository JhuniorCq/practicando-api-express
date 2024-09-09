import { MoviesModel } from "../models/movies.model.js";
import {
  validateMovie,
  validatePartialMovie,
} from "../utilities/validations/movieValidations.js";

export class MoviesController {
  static async getAll(req, res) {
    try {
      const { genre } = req.query;
      const movies = await MoviesModel.getAll({ genre });

      // La respuesta es la decisión de lo que quiere renderizar el Controller
      // Un JSON puede contar como una vista, así como un HTML
      res.status(200).json(movies);
    } catch (error) {
      console.error("", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const movie = await MoviesModel.getById({ id });
      if (!movie) return res.status(404).json({ message: "Movie not found" });
      res.status(200).json(movie);
    } catch (error) {
      console.error("", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      // Acá lo Primer que debemos hacer es VALIDAR los Datos, luego ya almacenamos los datos en una BD
      const validatedData = validateMovie(req.body);

      // Si los datos no son válidos:
      if (validatedData.error) {
        return res.status(400).json({
          message: "Data not validated",
          error: validatedData.error.issues,
        });
      }

      // Si los datos son válidos:
      const newMovie = await MoviesModel.create({
        validatedData: validatedData.data,
      });

      if (!newMovie)
        return res.status(400).json({ message: "Error inserting movie" });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error("", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await MoviesModel.delete({ id });
      if (!result) return res.status(404).json({ message: "Movie not found" });
      res.status(200).json({ message: "Eliminación exitosa" });
    } catch (error) {
      console.error("", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async partiallyUpdate(req, res) {
    try {
      const validatedData = validatePartialMovie(req.body);

      if (validatedData.error) {
        return res.status(400).json({
          message: "Data not validated",
          error: validatedData.error.issues,
        });
      }

      const { id } = req.params;

      const updateMovie = await MoviesModel.partiallyUpdate({
        id,
        validatedData: validatedData.data,
      });

      if (!updateMovie)
        return res
          .status(400)
          .json({ message: "Error when partially modifying" });

      res
        .status(200)
        .json({ message: `Se actualizó parcialmente la película ${id}` });
    } catch (error) {
      console.error("", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async fullyUpdate(req, res) {
    try {
      const validatedData = validateMovie(req.body);

      if (validatedData.error) {
        return res.status(400).json({
          message: "Data not validated",
          error: validatedData.error.issues,
        });
      }

      const { id } = req.params;

      const updateMovie = await MoviesModel.fullyUpdate({
        id,
        validatedData: validatedData.data,
      });

      if (!updateMovie) {
        return res
          .status(404)
          .json({ message: "Error when modifying completely" });
      }

      res
        .status(200)
        .json({ message: `Se actualizó completamente la película ${id}` });
    } catch (error) {
      console.error("", error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

// Creo que los Controllers también deben tener TRY / CATCH
