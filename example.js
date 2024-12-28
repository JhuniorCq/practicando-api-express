const dividir = (numerador, denominador) => {
  if (denominador === 0) {
    throw new Error("No se puede dividir por cero.");
  }

  return numerador / denominador;
};

try {
  const resultado = dividir(4, 0);
  console.log(`El resultado de la división es ${resultado}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
