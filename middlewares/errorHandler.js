export const errorHandler = (error, req, res, next) => {
  // Error por defecto
  res.status(error.statusCode ?? 500).json({
    error: true,
    message: error.message ?? "Error interno en el servidor.",
  });
};
