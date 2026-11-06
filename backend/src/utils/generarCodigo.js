/** Genera un identificador visible de orden (no criptográfico). */
function generarCodigoSeguimiento() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let aleatorio = '';
  for (let i = 0; i < 4; i += 1) {
    aleatorio += letras.charAt(Math.floor(Math.random() * letras.length));
  }
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `REP-${aleatorio}-${numero}`;
}

module.exports = { generarCodigoSeguimiento };
