import { pool } from "../config/db.js";

export const addMovieGenres = async (movies) => {
  // Agregamos los Géneros a cada Película del resultado "movies"
  for (const movie of movies) {
    const { id } = movie;
    const [genreNames] = await pool.query(
      `
            SELECT g.name FROM movie_genres mg 
            INNER JOIN genre g
            ON mg.genre_id = g.id
            WHERE mg.movie_id = ?
          `,
      [id]
    );
    // [{name: "Drama"}, {name: "Crime"}]
    movie.genre = genreNames.map((genre) => genre.name);
  }
};
