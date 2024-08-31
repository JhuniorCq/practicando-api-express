import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const moviesPath = path.join(process.cwd(), 'movies.json')
const moviesJSON = await fs.readFile(moviesPath, 'utf-8')
const movies = JSON.parse(moviesJSON)

export class MoviesModel {
  static async getAll ({ genre }) {
    // Obtener TODAS las Películas por GÉNERO de la "BD"
    if (genre) {
      const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      return filteredMovies
    }
    // Obteniendo todas las películas de la "BD"
    return movies
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ correctData }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...correctData
    }
    console.log(newMovie, correctData)
    // Lo que haremos ahora NO es algo de la Arquitectura REST, porque estamos GUARDANDO el Estado de la Aplicación en memoria
    movies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex < 0) return false

    // Si movie SÍ existe pasamos a eliminarlo
    movies.splice(movieIndex, 1)

    return true
  }

  static async partiallyUpdate ({ id, correctData }) {
    // Con esto obtengo el ÍNDICE del movie en el Array movies
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // Si el movie a modificar NO existe, se termina la función y se responde con un mensaje de error
    if (movieIndex < 0) return false

    // Si el movie SÍ existe, entonces tengo que ACTUALIZARLO con los datos del CUERPO de la Solicitud

    // Ahora ESTRUCTURO un Nuevo Objeto con todos los datos necesarios -> ¿Porque NO actualizo el movie directamente con el req.body? -> Esto es porque mi API está abierta a que le pasen cualquier DATO (eso es bueno según MIDUDEV), pero ya en el proceso DESCARTO los datos que NO me servirán para la actualización -> Esto es lo que hago al Estructurar este Nuevo Objeto paso a paso

    const updateMovie = {
      ...movies[movieIndex], // Traigo a todas las propiedades de la movie a modificar
      ...correctData // Sobreescribo la propiedad title, ya que esa propiedad es la que se estará modificando
    }

    movies[movieIndex] = updateMovie

    return updateMovie
  }

  static async fullyUpdate ({ id, correctData }) {
    // Con esto obtengo el ÍNDICE del movie en el Array movies
    const movieIndex = movies.findIndex((movie) => movie.id === id)

    // Si el movie a modificar NO existe, se termina la función y se responde con un mensaje de error
    if (movieIndex < 0) return false

    // Si el movie SÍ existe, entonces tengo que ACTUALIZARLO con los datos del CUERPO de la Solicitud

    // Ahora ESTRUCTURO un Nuevo Objeto con todos los datos necesarios -> ¿Porque NO actualizo el movie directamente con el req.body? -> Esto es porque mi API está abierta a que le pasen cualquier DATO (eso es bueno según MIDUDEV), pero ya en el proceso DESCARTO los datos que NO me servirán para la actualización -> Esto es lo que hago al Estructurar este Nuevo Objeto paso a paso
    const updateMovie = {
      id,
      ...correctData
    }

    movies[movieIndex] = updateMovie

    return updateMovie
  }
}
