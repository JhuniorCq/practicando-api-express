import { Router } from "express";
import { MoviesController } from "../controllers/movies.controller.js";
const router = Router();

// Todos los recursos que sean MOVIES se identifican con /movies
// Obtener a TODAS las Películas
router.get("/", MoviesController.getAll);
// Obtener una Película por ID
router.get("/:id", MoviesController.getById);
// Crear una Película
router.post("/", MoviesController.create);
// Actualizar completamente un movie
router.put("/:id", MoviesController.fullyUpdate);
// Actualizar parcialmente un movie
router.patch("/:id", MoviesController.partiallyUpdate);
// Eliminar un movie
router.delete("/:id", MoviesController.delete);

export { router };
