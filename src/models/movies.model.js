import crypto from "node:crypto";
import { pool } from "../config/db.js";
import { addMovieGenres } from "../utilities/validations/addMovieGenres.js";

export class MoviesModel {
  static async getAll({ genre }) {
    try {
      if (genre) {
        const lowerCaseGenre = genre.toLowerCase();

        // Primero tenemos que VERIFICAR si el GÉNERO que nos pasaron EXISTE -> Si NO existe, la Consulta devolverá un ARRAY VACÍO
        const [genreData] = await pool.query(
          "SELECT id, name FROM genre WHERE LOWER(name) = ?",
          [lowerCaseGenre]
        );
        console.log(genreData);

        if (genreData.length === 0) return [];

        // Si el GÉNERO SÍ EXISTE, entonces continuamos:
        const [{ name }] = genreData;
        const [movies] = await pool.query(
          `
            SELECT m.* FROM movie m
            INNER JOIN movie_genres mg ON m.id = mg.movie_id
            INNER JOIN genre g ON mg.genre_id = g.id
            WHERE LOWER(g.name) = ?
          `,
          [name]
        );

        if (movies.length !== 0) await addMovieGenres(movies);

        return movies;
      }

      // Agregar los géneros a estas películas
      const [movies] = await pool.query("SELECT * FROM movie");
      await addMovieGenres(movies);
      return movies;
    } catch (err) {
      console.error("Error en getAll de movies.model.js ");
      throw err;
    }
  }

  static async getById({ id }) {
    try {
      const [movie] = await pool.query("SELECT * FROM movie WHERE id = ?", [
        id,
      ]);
      console.log(movie);
      // Si la película no existe:
      if (movie.length === 0) {
        const error = new Error("Película no encontrada.");
        error.statusCode = 404;
        throw error;
      }

      return movie[0];
    } catch (err) {
      console.log("Error en getById de movies.model.js ", err.message);
      throw err;
    }
  }

  static async create({ validatedData }) {
    const connection = await pool.getConnection(); // Obtengo una conexión del pool
    try {
      const { title, year, director, duration, poster, rate, genre } =
        validatedData;

      const id = crypto.randomUUID();

      // Inicio la Transacción
      await connection.beginTransaction();

      // Verificamos la existencia de los géneros de las películas y obtenemos sus IDs registrados en la BD
      const genreIds = [];

      for (const genreName of genre) {
        const [result] = await pool.query(
          "SELECT id FROM genre WHERE LOWER(name) = ?",
          [genreName.toLowerCase()]
        );

        // Esto de que si NO existe el género puede ir en las Validaciones, pero hariamos un SELECT a todos los géneros para validar eso
        if (result.length === 0) {
          const error = new Error(`Èl género ${genreName} no existe.`);
          error.statusCode = 404;
          throw error;
        }

        genreIds.push(result[0].id);
      }

      // Insertamos la película en la Base de Datos
      const [result] = await pool.query(
        "INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, title, year, director, duration, poster, rate]
      );
      // Si el affectRows es 0 quiere decir que NO hubo ninguna fila afectada
      if (result.affectedRows === 0) {
        const error = new Error("Error al almacenar la película.");
        error.statusCode = 500;
        throw error;
      }

      // Insertamos el ID de la Película y el ID de sus Géneros en la tabla movie_genres
      for (const genreId of genreIds) {
        const [result] = await pool.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
          [id, genreId]
        );

        if (result.affectedRows === 0) {
          console.error(
            "Error al insertar en la tabla movie_genres -> Método create de movies.model.js."
          );
          throw new Error();
        }
      }

      // Hago commit para confirmar todas las operaciones hechas hasta el momento
      await connection.commit(); // Se finaliza la Transacción con el commit

      // Devolvemos la película recién creada (Usamos la misma conexión porque aún no es liberada)
      const [movie] = await connection.query(
        "SELECT * FROM movie WHERE id = ?",
        [id]
      );

      if (movie.length === 0) {
        throw new Error("Error al recuperar la película creada.");
      }

      // Añadimos los géneros a la película antes de devolverla
      await addMovieGenres(movie);

      return movie[0];
    } catch (error) {
      // Hago rollback en caso ocurra un error durante la transacción
      await connection.rollback();
      console.error("Error en create de movies.model.js ", error.message);
      throw error;
    } finally {
      // Libero la conexión, y esta se devuelve al pool de conexiones
      connection.release();
    }
  }

  static async delete({ id }) {
    try {
      // Verificamos la existencia de la película
      const [movieExists] = await pool.query(
        "SELECT id FROM movie WHERE id = ?",
        [id]
      );

      // Si no existe la película:
      if (movieExists.length === 0) {
        const error = new Error("La película no existe.");
        error.statusCode = 404;
        throw error;
      }

      // Eliminamos la película de la tabla movie_genres
      await pool.query("DELETE FROM movie_genres WHERE movie_id = ?", [id]);

      // Eliminamos la película de la tabla movie
      await pool.query("DELETE FROM movie WHERE id = ?", [id]);

      // Si queremos que se devuelva la Película eliminada, debemos hacer un SELECT
      return "Eliminación exitosa";
    } catch (error) {
      console.log("Error en delete de movies.model.js", error.message);
      throw error;
    }
  }

  static async partiallyUpdate({ id, validatedData }) {
    try {
      // Creamos dos arrays, uno para almacenar los Campos a Actualizar y el otro para los Valores con los cuales se actualizarán
      const fieldsToUpdate = [];
      const values = [];

      // Recorremos los datos validados y construimos una PORCIÓN de la Query
      Object.keys(validatedData).forEach((key, index) => {
        fieldsToUpdate.push(`${key} = ?`); // Usamos el ? en vez del Valor correspondiente, para así evitar un SQL INJECTION
        values.push(validatedData[key]); // Añadimos el valor correspondiente
      });

      // Añadimos el ID como último parámetro en el Array de Valores
      values.push(id);

      // Si no hay campos para actualizar, retornamos null
      if (fieldsToUpdate.length === 0) return null;

      // Ejecutamos la Consulta SQL
      const [resultUpdate] = await pool.query(
        `UPDATE movie SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
        [values]
      );

      // Verificamos si se actualizó alguna fila
      if (resultUpdate.affectedRows === 0) return null;

      // Retornamos true si todo salió exitosamente
      return true;
    } catch (err) {
      console.error(
        "Error en partiallyUpdate de movies.model.js ",
        err.message
      );
      throw err;
    }
  }

  static async fullyUpdate({ id, validatedData }) {
    try {
      const { title, year, director, duration, poster, rate, genre } =
        validatedData;

      // Verificamos si la película existe (usando su ID)
      const [movieExists] = await pool.query(
        "SELECT id FROM movie WHERE id = ?",
        [id]
      );

      if (movieExists.length === 0) return null;

      // Verificamos si los géneros existen (creo que esto ya no estaría si validamos esta existencia en movieValidations.js)
      const genreIds = [];
      // - Obtenemos el ID de cada uno de los géneros que nos pasaron
      for (const genreName of genre) {
        const [genreId] = await pool.query(
          "SELECT id FROM genre WHERE LOWER(name) = ?",
          [genreName.toLowerCase()]
        );

        if (genreId.length === 0) return null; // En todos estos casos que retornamos null, creo que mejor sería retornar un objeto con la propiedad "error"

        genreIds.push(genreId[0].id);
      }

      // Actualizamos la tabla movie
      const [resultUpdate] = await pool.query(
        `
        UPDATE movie
        SET
          title = ?,
          year = ?,
          director = ?,
          duration = ?,
          poster = ?,
          rate = ?
        WHERE id = ?  
      `,
        [title, year, director, duration, poster, rate, id]
      );

      if (resultUpdate.affectedRows === 0) return null; // Se entrará acá si el id del movie NO existe
      console.log("Actualizando movie: ", resultUpdate);

      // Actualizamos la tabla movie_genres -> Eliminamos los géneros ya existentes
      const [resultDelete] = await pool.query(
        "DELETE FROM movie_genres WHERE movie_id = ?",
        [id]
      );
      if (resultDelete.affectedRows === 0) return null;
      console.log("Eliminando géneros de movie_genres: ", resultDelete);

      // Insertamos el ID de la película y de sus géneros en movie_genres
      for (const genreId of genreIds) {
        const [resultInsert] = await pool.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
          [id, genreId]
        );
        if (resultInsert.affectedRows === 0) return null;
        console.log("Insertando en movie_genres: ", resultInsert);
      }

      return true;
    } catch (err) {
      console.error("Error en fullyUpdate de movies.mode.js ", err.message);
      throw err;
    }
  }
}
