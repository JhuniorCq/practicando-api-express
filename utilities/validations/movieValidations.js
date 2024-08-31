// Validaciones para POST
export const validationsCreateMovie = (data) => {
  const errors = []

  // Desestructuramos solo las propiedades que nos interesan (así evitamos datos innecesarios (como un SQL Injection))
  const { title, year, director, duration, poster, rate, genre } = data

  // Validaciones para cada dato
  if (!title || typeof title !== 'string' || title.length > 255) {
    errors.push('Title is required and must be a string of max 255 characters.')
  }

  if (!year || typeof year !== 'number' || year < 1800 || year > new Date().getFullYear()) {
    errors.push('Year is required and must be a valid number between 1800 and the current year.')
  }

  if (!director || typeof director !== 'string' || director.length > 255) {
    errors.push('Director is required and must be a string of max 255 characters.')
  }

  if (!duration || typeof duration !== 'number' || duration <= 0) {
    errors.push('Duration is required and must be a positive number.')
  }

  if (!poster || typeof poster !== 'string' || !poster.startsWith('http')) {
    errors.push('Poster is required and must be a valid URL.')
  }

  if (!rate || typeof rate !== 'number' || rate < 0 || rate > 10) {
    errors.push('Rate is required and must be a number between 0 and 10.')
  }

  if (!Array.isArray(genre) || genre.length === 0 || !genre.every(g => typeof g === 'string')) {
    errors.push('Genre is required and must be an array of strings.')
  }

  // Si hubo algún error, retornamos un objeto con los errores
  if (errors.length > 0) return { errors }

  // Si no hay errores, retornamos el objeto válido

  return {
    title,
    year,
    director,
    duration,
    poster,
    rate,
    genre
  }
}
// Validaciones para PUT

// Validaciones para PATCH
