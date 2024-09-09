import { GenresModel } from "../models/genres.model.js";

const genresName = await GenresModel.getAll();
export const ALLOWED_GENRES = genresName.map((g) => g.name.toLowerCase());
