const { generarCodigoSeguimiento } = require('../utils/generarCodigo');

const ESTADOS_VALIDOS = ['Ingresado', 'En Diagnóstico', 'Reparado', 'Entregado'];

function validarDatosOrden(datos = {}) {
  datos = datos || {};
  const nombreCliente = datos.nombreCliente?.trim();
  const email = datos.email?.trim();
  const telefono = datos.telefono?.trim();
  const marca = datos.marca?.trim();
  const modelo = datos.modelo?.trim();
  const problemaReportado = datos.problemaReportado?.trim();

  if (!nombreCliente) throw new Error('El nombre del cliente es obligatorio');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email inválido');
  if (!telefono || telefono.length < 8) throw new Error('Teléfono inválido');
  if (!marca) throw new Error('La marca es obligatoria');
  if (!modelo) throw new Error('El modelo es obligatorio');
  if (!problemaReportado) throw new Error('El problema reportado es obligatorio');

  return { nombreCliente, email, telefono, marca, modelo, problemaReportado };
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
    throw new Error(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return estado;
}

module.exports = { crearOrdenReparacion, validarDatosOrden, validarEstado, ESTADOS_VALIDOS };
