import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'moviesdb'
  // connectionLimit: 10 -> Si no se especifica, por defecto será 10
}

const pool = mysql.createPool(config)

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
    }
  }

  static async create ({ validatedData }) {
    try {
      const {
        id,
        title,
        year,
        director,
        duration,
        poster,
        rate,
        genre
      } = validatedData

      // Insertamos la película en la Base de Datos
      const [result] = await pool.query('INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        id, title, year, director, duration, poster, rate
      ])

      console.log('Resultados de insertar en la Tabla: "movie"', result)

      // Verificamos la existencia de los géneros de las películas y obtenemos sus IDs registrados en la BD
      console.log(genre)
      // Insertamos el ID de las Películas y el ID de sus Géneros en la tabla movie_genres
      // const [result2] = await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)', [])
    } catch (err) {
      console.error('', err.message)
    }
  }

  static async delete ({ id }) {

  }

  static async partiallyUpdate ({ id, validatedData }) {

  }

  static async fullyUpdate ({ id, validatedData }) {

  }
}
