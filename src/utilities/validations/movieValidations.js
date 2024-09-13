import { z } from "zod";
import { ALLOWED_GENRES } from "../getGenres.js";

// Aunque acá solo podría VALIDAR que el ARRAY es de STRNGS, y ya en el MODELO VALIDAR si los géneros existen en la BD

const movieSchema = z.object({
  title: z.string({ message: "El título debe ser una cadena de texto." }),
  year: z
    .number({ message: "El año debe ser un número." })
    .int({ message: "El año debe ser un número entero." })
    .min(1900, { message: "El año debe ser como mínimo 1900." })
    .max(2024, { message: "El año debe ser como máximo 2024." }),
  director: z.string({ message: "El director debe ser una cadena de texto." }),
  duration: z
    .number({ message: "La duración debe ser un número." })
    .int({ message: "La duración debe ser un número entero." })
    .positive({ message: "La duración debe ser un número entero positivo." }),
  poster: z
    .string({ message: "La URL debe ser una cadena de texto." })
    .url({ message: "Ingrese correctamente la URL." }),
  rate: z
    .number({ message: "La calificación debe ser un número" })
    .min(0, { message: "La calificación debe ser como mínimo 0." })
    .max(10, { message: "La calificación debe ser como máximo 10." }),
  genre: z
    .array(
      z.string({ message: "Todos los géneros deben ser cadenas de texto." })
    )
    .refine(
      (genres) => genres.every((g) => ALLOWED_GENRES.includes(g.toLowerCase())),
      { message: "Uno de los géneros no está permitido." }
    ),
});

// Función para VALIDAR el CUERPO de una Solicitud POST o PUT
export const validateMovie = (object) => {
  return movieSchema.safeParse(object);
};

// Función para VALIDAR el CUERPO de una Solicitud PATCH
export const validatePartialMovie = (object) => {
  return movieSchema.partial().safeParse(object);
};
