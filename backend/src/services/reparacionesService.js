
const { generarCodigoSeguimiento } = require('../utils/generarCodigo');

const ESTADOS_VALIDOS = [
  'Ingresado',
  'En Diagnóstico',
  'Reparado',
  'Entregado'
];

function crearErrorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.statusCode = 400;
  return error;
}

function validarDatosOrden(datos = {}) {
  if (datos === null || datos === undefined) {
    datos = {};
  }

  if (typeof datos !== 'object' || Array.isArray(datos)) {
    throw crearErrorValidacion('Los datos de la orden son inválidos');
  }

  const obtenerTexto = (valor) =>
    typeof valor === 'string' ? valor.trim() : '';

  const nombreCliente = obtenerTexto(datos.nombreCliente);
  const email = obtenerTexto(datos.email);
  const telefono = obtenerTexto(datos.telefono);
  const marca = obtenerTexto(datos.marca);
  const modelo = obtenerTexto(datos.modelo);
  const problemaReportado = obtenerTexto(datos.problemaReportado);

  if (!nombreCliente) {
    throw crearErrorValidacion('El nombre del cliente es obligatorio');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw crearErrorValidacion('Email inválido');
  }

  if (!telefono || telefono.length < 8) {
    throw crearErrorValidacion('Teléfono inválido');
  }

  if (!marca) {
    throw crearErrorValidacion('La marca es obligatoria');
  }

  if (!modelo) {
    throw crearErrorValidacion('El modelo es obligatorio');
  }

  if (!problemaReportado) {
    throw crearErrorValidacion('El problema reportado es obligatorio');
  }

  return {
    nombreCliente,
    email,
    telefono,
    marca,
    modelo,
    problemaReportado
  };
}

function crearOrdenReparacion(datosInput, hoy = new Date()) {
  const datosValidados = validarDatosOrden(datosInput);

  return {
    ...datosValidados,
    estado: 'Ingresado',
    fechaIngreso: hoy.toISOString().split('T')[0],
    fechaSalida: null,
    codigoSeguimiento: generarCodigoSeguimiento()
  };
}

function validarEstado(estado) {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw crearErrorValidacion(
      `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`
    );
  }

  return estado;
}

module.exports = {
  crearOrdenReparacion,
  validarDatosOrden,
  validarEstado,
  ESTADOS_VALIDOS
};
