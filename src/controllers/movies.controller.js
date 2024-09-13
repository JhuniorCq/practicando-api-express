import { MoviesModel } from "../models/movies.model.js";
import {
  validateMovie,
  validatePartialMovie,
} from "../utilities/validations/movieValidations.js";

export class MoviesController {
  static async getAll(req, res, next) {
    try {
      const { genre } = req.query;
      const movies = await MoviesModel.getAll({ genre });

      // La respuesta es la decisión de lo que quiere renderizar el Controller
      // Un JSON puede contar como una vista, así como un HTML
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error en getAll de movies.controller.js");
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await MoviesModel.getById({ id });

      res.status(200).json(movie);
    } catch (error) {
      console.error("Error en getById de movies.controller.js");
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Acá lo Primer que debemos hacer es VALIDAR los Datos, luego ya almacenamos los datos en una BD
      const validatedData = validateMovie(req.body);

      // Si los datos no son válidos:
      if (validatedData.error) {
        const error = new Error();
        error.message = validatedData.error.issues;
        error.statusCode = 400;
        throw error;
      }

      // Si los datos son válidos:
      const newMovie = await MoviesModel.create({
        validatedData: validatedData.data,
      });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error("Error en create de movies.controller.js");
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await MoviesModel.delete({ id });
      res.status(200).json({ message: result });
    } catch (error) {
      console.error("Error en delete de movies.controller.js", error.message);
      next(error);
    }
  }

  static async partiallyUpdate(req, res, next) {
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

  static async fullyUpdate(req, res, next) {
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
