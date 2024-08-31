import crypto from 'node:crypto'
import { pool } from '../config/db.js'

export class MoviesModel {
  static async getAll ({ genre }) {
    try {
      if (genre) {
        const lowerCaseGenre = genre.toLowerCase()

        // Primero tenemos que VERIFICAR si el GÉNERO que nos pasaron EXISTE -> Si NO existe, la Consulta devolverá un ARRAY VACÍO
        const [genreData] = await pool.query('SELECT id, name FROM genre WHERE LOWER(name) = ?', [lowerCaseGenre])

        if (genreData.length === 0) return []

        // Si el GÉNERO SÍ EXISTE, entonces continuamos:
        const [{ name }] = genreData
        const [movies] = await pool.query(`
            SELECT m.*, g.name as genre FROM movie m
            INNER JOIN movie_genres mg ON m.id = mg.movie_id
            INNER JOIN genre g ON mg.genre_id = g.id
            WHERE LOWER(g.name) = ?
          `, [name])

        return movies
      }

      const [movies] = await pool.query('SELECT * FROM movie')
      console.log(movies)
      return movies
    } catch (err) {
      console.error('Error getting movies: ', err.message)
      throw err
    }
  }

  static async getById ({ id }) {
    try {
      const [movie] = await pool.query('SELECT * FROM movie WHERE id = ?', [id])
      console.log(movie)
      // Si la película no existe:
      if (movie.length === 0) return null

      return movie[0]
    } catch (err) {
      console.log('Error getting movie', err.message)
      throw err
    }
  }

  static async create ({ validatedData }) {
    try {
      const {
        title,
        year,
        director,
        duration,
        poster,
        rate,
        genre
      } = validatedData

      const id = crypto.randomUUID()

      // Insertamos la película en la Base de Datos
      const [result] = await pool.query('INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        id, title, year, director, duration, poster, rate
      ])
      // Si el affectRows es 0 quiere decir que NO hubo ninguna fila afectada
      if (result.affectedRows === 0) return null

      // Verificamos la existencia de los géneros de las películas y obtenemos sus IDs registrados en la BD
      const genreIds = []

      for (const genreName of genre) {
        const [result] = await pool.query('SELECT id FROM genre WHERE LOWER(name) = ?', [genreName.toLowerCase()])

        // Esto de que si NO existe el género puede ir en las Validaciones, pero hariamos un SELECT a todos los géneros para validar eso
        if (result.length === 0) return null

        genreIds.push(result[0].id)
      }

      // Insertamos el ID de las Películas y el ID de sus Géneros en la tabla movie_genres
      for (const genreId of genreIds) {
        await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)', [id, genreId])
      }

      // Obtenemos la película insertada usando su ID
      const [movie] = await pool.query('SELECT * FROM movie WHERE id = ?', [id])

      if (movie.length === 0) return null

      return movie[0]
    } catch (err) {
      console.error('', err.message)
      throw err
    }
  }

  static async delete ({ id }) {
    try {
      // Eliminamos la película de la tabla movie_genres
      const [result1] = await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [id])

      if (result1.affectedRows === 0) return null

      // Eliminamos la película de la tabla movie
      const [result2] = await pool.query('DELETE FROM movie WHERE id = ?', [id])

      if (result2.affectedRows === 0) return null

      // Si queremos que se devuelva la Película eliminada, debemos hacer un SELECT
      return true
    } catch (err) {
      console.log('', err.message)
      throw err
    }
  }

  static async partiallyUpdate ({ id, validatedData }) {

  }

  static async fullyUpdate ({ id, validatedData }) {

  }
}
