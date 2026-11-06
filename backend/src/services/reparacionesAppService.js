
const repository = require('../repositories/reparacionesRepository');

const {
  crearOrdenReparacion,
  validarDatosOrden,
  validarEstado
} = require('./reparacionesService');

function crearErrorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.statusCode = 400;
  return error;
}

function validarId(id) {
  if (!/^[1-9]\d*$/.test(String(id))) {
    throw crearErrorValidacion('Identificador inválido');
  }

  return Number(id);
}

async function registrar(datos) {
  return repository.guardarOrden(crearOrdenReparacion(datos));
}

async function listar(filtros) {
  return repository.listarOrdenes(filtros);
}

async function seguimiento(codigo) {
  if (typeof codigo !== 'string' || !codigo.trim()) {
    throw crearErrorValidacion('El código de seguimiento es obligatorio');
  }

  return repository.buscarPorCodigo(codigo.trim().toUpperCase());
}

async function cambiarEstado(id, estado) {
  return repository.actualizarEstado(
    validarId(id),
    validarEstado(estado)
  );
}

async function editar(id, datos) {
  return repository.actualizarOrden(
    validarId(id),
    validarDatosOrden(datos)
  );
}

async function eliminar(id) {
  return repository.eliminarOrden(validarId(id));
}

module.exports = {
  registrar,
  listar,
  seguimiento,
  cambiarEstado,
  editar,
  eliminar
};
