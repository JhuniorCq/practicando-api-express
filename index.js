import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as routerMovies } from "./src/routes/movies.routes.js";
import { router as routerGenres } from "./src/routes/genres.routes.js";
import { PORT } from "./src/config/config.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.disable("x-powered-by"); // Deshabilitamos la cabecera X-Powered-By: Express
app.use(cors()); // Este middleware soluciona el problemas del CORS, pero coloca por defecto "*"
app.use(morgan("dev"));
app.use(express.json()); // Middleware que convierte el CUERPO de la Solicitud en un Objeto/Array de JS

app.get("/", (req, res) => {
  res.send(`Hola, estás en ${req.url}`);
});

app.use("/movies", routerMovies);
app.use("/genres", routerGenres);

// Este es un middleware para manejar un Error 404 cuando la ruta no existe
app.use((req, res) => {
  res.status(404).json({ message: "Error 404 Not Found" });
});

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Dato: cors() -> Devuelve uns instancia que es un Middleware -> Por ejemplo: cors() devuelve "cors", igualmente con morgan() -> morgan() devuelve "morgan" -> Tanto "cors" como "morgan" son Middlewares (osea funciones) devueltos por las funciones cors() y morgan() respectivamente
