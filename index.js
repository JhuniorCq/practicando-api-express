import express from 'express'
import cors from 'cors'
import { router as routerMovies } from './routes/movies.routes.js'

const app = express()
const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by') // Deshabilitamos la cabecera X-Powered-By: Express
app.use(cors()) // Este middleware soluciona el problemas del CORS, pero coloca por defecto "*"
app.use(express.json()) // Middleware que convierte el CUERPO de la Solicitud en un Objeto/Array de JS

app.use('/movies', routerMovies)

app.get('/', (req, res) => {
  res.send(`Hola, estás en ${req.url}`)
})

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})
