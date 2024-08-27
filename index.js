import express from 'express'
import cors from 'cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const app = express()
const PORT = process.env.PORT ?? 1234

const moviesPath = path.join(process.cwd(), 'movies.json')
const moviesJSON = await fs.readFile(moviesPath, 'utf-8')
const movies = JSON.parse(moviesJSON)

app.disable('x-powered-by') // Deshabilitamos la cabecera X-Powered-By: Express
app.use(cors()) // Este middleware soluciona el problemas del CORS, pero coloca por defecto "*"
app.use(express.json()) // Middleware que convierte el CUERPO de la Solicitud en un Objeto/Array de JS

app.get('/', (req, res) => {
  res.send(`Hola, estás en ${req.url}`)
})

// Todos los recursos que sean MOVIES se identifican con /movies

// Obtener a TODAS las Películas
app.get('/movies', (req, res) => {
  const { genre } = req.query

  // Obtener TODAS las Películas por GÉNERO
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.status(200).json(filteredMovies)
  }

  res.status(200).json(movies)
})

// Obtener una Película por ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)

  if (!movie) return res.status(404).json({ message: 'Movie not found' })
  res.status(200).json(movie)
})

// Crear una Película
app.post('/movies', (req, res) => {
  const { title, genre, year, director, duration, poster, rate } = req.body

  // Acá lo Primer que debemos hacer es VALIDAR los Datos, luego ya almacenamos los datos en una BD
  // if (!validatedData) {
  //   return res.status(400).json({ error: 'Los datos no son válidos' })
  // }

  const newMovie = {
    id: crypto.randomUUID(),
    title,
    year,
    director,
    duration,
    genre,
    poster,
    rate: rate ?? 0
  }
  // Lo que haremos ahora NO es algo de la Arquitectura REST, porque estamos GUARDANDO el Estado de la Aplicación en memoria
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// Actualizar completamente un movie
app.put('/movies/:id', (req, res) => {
  const { title, genre, year, director, duration, poster, rate, fakeProperty } = req.body
  // Antes de todo debemos VALIDAR los Datos del Cuerpo de la Solicitud
  // if (!validatedData) {
  //   return res.status(400).json({ error: 'Los datos no son válidos' })
  // }

  const { id } = req.params

  // Con esto obtengo el ÍNDICE del movie en el Array movies
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  // Si el movie a modificar NO existe, se termina la función y se responde con un mensaje de error
  if (movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

  // Si el movie SÍ existe, entonces tengo que ACTUALIZARLO con los datos del CUERPO de la Solicitud

  // Ahora ESTRUCTURO un Nuevo Objeto con todos los datos necesarios -> ¿Porque NO actualizo el movie directamente con el req.body? -> Esto es porque mi API está abierta a que le pasen cualquier DATO (eso es bueno según MIDUDEV), pero ya en el proceso DESCARTO los datos que NO me servirán para la actualización -> Esto es lo que hago al Estructurar este Nuevo Objeto paso a paso
  const newMovie = {
    id,
    title,
    year,
    director,
    duration,
    poster,
    genre,
    rate
  }
  console.log(`Este es el DATO que NO me sirve para actualizar el movie: ${fakeProperty}`)

  movies[movieIndex] = newMovie

  res.status(200).json({ message: `Se actualizó completamente la película ${id}` })
})

// Actualizar parcialmente un movie
app.patch('/movies/:id', (req, res) => {
  const { title, fakeProperty } = req.body
  // Antes de todo debemos VALIDAR los Datos del Cuerpo de la Solicitud
  // if (!validatedData) {
  //   return res.status(400).json({ error: 'Los datos no son válidos' })
  // }

  const { id } = req.params
  // Con esto obtengo el ÍNDICE del movie en el Array movies
  const movieIndex = movies.findIndex(movie => movie.id === id)

  // Si el movie a modificar NO existe, se termina la función y se responde con un mensaje de error
  if (movieIndex < 0) return res.status(400).json({ message: 'Movie not found' })

  // Si el movie SÍ existe, entonces tengo que ACTUALIZARLO con los datos del CUERPO de la Solicitud

  // Ahora ESTRUCTURO un Nuevo Objeto con todos los datos necesarios -> ¿Porque NO actualizo el movie directamente con el req.body? -> Esto es porque mi API está abierta a que le pasen cualquier DATO (eso es bueno según MIDUDEV), pero ya en el proceso DESCARTO los datos que NO me servirán para la actualización -> Esto es lo que hago al Estructurar este Nuevo Objeto paso a paso

  const updateMovie = {
    ...movies[movieIndex], // Traigo a todas las propiedades de la movie a modificar
    title // Sobreescribo la propiedad title, ya que esa propiedad es la que se estará modificando
  }
  console.log(`Este es el DATO que NO me sirve para actualizar el movie: ${fakeProperty}`)

  movies[movieIndex] = updateMovie

  res.status(200).json({ message: `Se actualizó parcialmente la película ${id}` })
})

// Eliminar un movie
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

  // Si movie SÍ existe pasamos a eliminarlo
  movies.splice(movieIndex, 1)

  res.status(200).json({ message: 'Eliminación exitosa' })
})

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})
