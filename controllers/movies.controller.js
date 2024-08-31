// import { MoviesModel } from '../models/movies.model.before.js'
import { MoviesModel } from '../models/movies.model.js'
import { validationsCreateMovie } from '../utilities/validations/movieValidations.js'

export class MoviesController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MoviesModel.getAll({ genre })

    // La respuesta es la decisión de lo que quiere renderizar el Controller
    // Un JSON puede contar como una vista, así como un HTML
    res.status(200).json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MoviesModel.getById({ id })
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.status(200).json(movie)
  }

  static async create (req, res) {
    // Acá lo Primer que debemos hacer es VALIDAR los Datos, luego ya almacenamos los datos en una BD
    const validatedData = validationsCreateMovie(req.body)

    // Si los datos no son válidos:
    if (validatedData.errors) return res.status(400).json({ message: 'Data not validated', error: validatedData.errors })

    // Si los datos son válidos:
    const newMovie = await MoviesModel.create({ validatedData })

    if (!newMovie) return res.status(400).json({ message: 'Error inserting movie' })

    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MoviesModel.delete({ id })
    if (!result) return res.status(404).json({ message: 'Movie not found' })
    res.status(200).json({ message: 'Eliminación exitosa' })
  }

  static async partiallyUpdate (req, res) {
    const { title, fakeProperty } = req.body
    // Antes de todo debemos VALIDAR los Datos del Cuerpo de la Solicitud
    // if (!validatedData) {
    //   return res.status(400).json({ error: 'Los datos no son válidos' })
    // }

    // Este correctData debería ser devuelto por mi función de validación, y debería contener un nuevo Objeto con los datos que se usarán y estos ya validados (digo "que se usarán", por si el usuario mandó un dato que no sirve)
    const correctData = { title }

    const { id } = req.params

    const updateMovie = await MoviesModel.partiallyUpdate({ id, correctData })

    // Si el movie a modificar NO existe, se termina la función y se responde con un mensaje de error
    if (!updateMovie) return res.status(400).json({ message: 'Movie not found' })

    console.log(`Este es el DATO que NO me sirve para actualizar el movie: ${fakeProperty}`)

    res.status(200).json({ message: `Se actualizó parcialmente la película ${id}` })
  }

  static async fullyUpdate (req, res) {
    const { title, genre, year, director, duration, poster, rate, fakeProperty } = req.body
    // Antes de todo debemos VALIDAR los Datos del Cuerpo de la Solicitud
    // if (!validatedData) {
    //   return res.status(400).json({ error: 'Los datos no son válidos' })
    // }

    // Este correctData debería ser devuelto por mi función de validación, y debería contener un nuevo Objeto con los datos que se usarán y estos ya validados (digo "que se usarán", por si el usuario mandó un dato que no sirve)
    const correctData = { title, genre, year, director, duration, poster, rate }

    const { id } = req.params

    const updateMovie = await MoviesModel.fullyUpdate({ id, correctData })

    // Si el movie a modificar NO existe, se termina la función y se responde con un mensaje de error
    if (!updateMovie) return res.status(404).json({ message: 'Movie not found' })
    console.log(`Este es el DATO que NO me sirve para actualizar el movie: ${fakeProperty}`)

    res.status(200).json({ message: `Se actualizó completamente la película ${id}` })
  }
}

// HAY QUE PASAR ACÁ A TODAS LAS FUNCIOES DE LAS RUTAS
