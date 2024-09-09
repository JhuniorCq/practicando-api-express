// import { z } from "zod";

// const movieSchema = z.object({
//   title: z.string(),
//   year: z.number(),
//   director: z.string(),
//   duration: z.number(),
//   poster: z.string(),
//   rate: z.number(),
//   genre: z.array(z.string()),
// });

// // Hacemos opcionales solo 'year' y 'duration', pero los demás campos permanecen obligatorios
// const partialSchema = movieSchema
//   .pick({ year: true, duration: true })
//   .partial();

// // Mezclamos el esquema original y el parcial para mantener la estructura
// const customSchema = movieSchema.merge(partialSchema);

// const result = customSchema.safeParse({
//   title: "Pelicula",
//   director: "Director",
//   poster: "http://poster.url",
//   rate: 9,
//   genre: ["action", "drama"],
// });
// console.log(result.success); // true (ya que los campos obligatorios están presentes)

// const movieSchema = z.object({
//   title: z.string(),
//   year: z.number(),
//   director: z.string(),
//   duration: z.number(),
//   poster: z.string(),
//   rate: z.number(),
//   genre: z.array(z.string()),
// });

// // Hacemos opcionales todas las propiedades excepto 'title' y 'director'
// const partialSchema = movieSchema
//   .omit({ title: true, director: true })
//   .partial();

// // Mezclamos el esquema original y el parcial para mantener la estructura
// const customSchema = movieSchema.merge(partialSchema);

// const result = customSchema.safeParse({
//   title: "Pelicula",
//   director: "Director",
// });
// console.log(result.success); // true (ya que 'title' y 'director' son obligatorios, los demás pueden estar ausentes)

// Esquema para validar un array de strings que serán transformadas a números
// const numberArraySchema = z
//   .array(z.string().transform((val) => parseFloat(val))) // Transformamos cada cadena en un número
//   .refine((arr) => arr.every((num) => num > 0), {
//     message: "Todos los números deben ser positivos.",
//   })
//   .refine((arr) => arr.every((num) => num % 3 === 0), {
//     message: "Todos los números deben ser divisibles por 3.",
//   });

// // Validamos un array de strings que representan números
// const result = numberArraySchema.safeParse(["9", "12", "18", "5"]);

// console.log(result); // { success: true, data: [ 9, 12, 18 ] }
// console.log(result.error);
// console.log(result.error.message, typeof result.error.message);

// Creamos un esquema que transforma un string a número y luego lo valida
// const schema = z
//   .string()
//   .transform((val) => parseInt(val, 10)) // Transformamos el string a número
//   .refine((val) => val > 10, {
//     // Validamos que el número sea mayor a 10
//     message: "El número debe ser mayor que 10",
//   });

// // Validamos un valor de ejemplo
// const result = schema.safeParse("8");

// console.log(result);

// Creamos un esquema que espera un string, pero lo transforma a un número
// const schema = z.string().transform((val) => parseInt(val, 10));

// // Validamos un valor de ejemplo
// const result = schema.safeParse("42");

// console.log(result);

// const schema = z.array(z.enum(["a", "b", "c", "d"]));
// const result = schema.safeParse(["a", "b", "c"]);
// console.log(result);

// Definimos un esquema donde 'email' puede ser un string o null
// const userSchema = z.object({
//   name: z.string(),
//   age: z.number().int().min(18),
//   email: z.string().email().nullable(), // Email puede ser string o null
// });

// // Validamos un objeto que tiene el campo email como null
// const result = userSchema.safeParse({
//   name: "John",
//   age: 30,
//   email: null,
// });

// console.log(result);

// ESQUEMA USANDO z.optional()
// const userSchema = z.object({
//   name: z.string(),
//   dni: z.string().length(8),
//   edad: z.number().int().min(18).max(75).optional(),
// });

// const user = {
//   name: "Jhunior",
//   dni: "73332032",
// };

// const result = userSchema.safeParse(user);
// console.log(result);

// console.log(result.error.message);

// ESQUEMA USANDO z.union()
// const unionSchema = z.union([z.string().min(2), z.number().int()]);
// const valor = "Hola"; // También puede ser 5, pero NO 5.3 ni "A"
// const result = unionSchema.safeParse(valor);

// console.log(result);

// VALIDANDO UN ARRAY
// const arraySchema = z.array(
//   z.union([z.number().int(), z.string(), z.boolean()])
// );

// // Datos para validar
// const array = [1, 2, 3, 4, true, "hola"];

// const result = arraySchema.safeParse(array);

// console.log(result);

// VALIDANDO UN OBJETO
// const user = {
//   name: "Jhunior",
//   age: 22,
//   genre: "M",
//   dni: "7333203",
//   email: "holiver.ccora.quispe@gmail.com",
// };

// const userSchema = z.object({
//   name: z.string({ message: "El nombre debe ser una cadena de texto." }),
//   age: z
//     .number({ message: "La edad debe ser un número." })
//     .int({ message: "La edad debe ser un número entero" })
//     .min(14, { message: "La edad debe ser como mínimo 14." })
//     .max(65, { message: "La edad debe ser como máximo 65." }),
//   genre: z.enum(["M", "F", "m", "f"], {
//     message: "El género debe ser 'M' o 'F'",
//   }),
//   dni: z
//     .string({ message: "El DNI debe ser una cadena de texto." })
//     .length(8, { message: "El DNI debe tener 8 caracteres." }),
//   email: z
//     .string({ message: "El correo debe ser una cadena de texto." })
//     .email({ message: "Ingresa un correo electrónico válido." }),
// });

// const result = userSchema.safeParse(user);
// console.log(JSON.parse(result.error.message)[0].message);
