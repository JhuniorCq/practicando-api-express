export const errorHandler = (error, req, res, nexts) => {
  // Error por defecto
  res
    .status(error.status ?? 500)
    .json({ message: error.message ?? "Error interno en el servidor" });
};
