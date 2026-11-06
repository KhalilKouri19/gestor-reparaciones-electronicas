const repository = require('../repositories/reparacionesRepository');
const { crearOrdenReparacion, validarDatosOrden, validarEstado } = require('./reparacionesService');

async function registrar(datos) { return repository.guardarOrden(crearOrdenReparacion(datos)); }
async function listar(filtros) { return repository.listarOrdenes(filtros); }
async function seguimiento(codigo) {
  if (!codigo?.trim()) throw new Error('El código de seguimiento es obligatorio');
  return repository.buscarPorCodigo(codigo.trim().toUpperCase());
}
async function cambiarEstado(id, estado) {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) throw new Error('Identificador inválido');
  return repository.actualizarEstado(Number(id), validarEstado(estado));
}
async function editar(id, datos) {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) throw new Error('Identificador inválido');
  return repository.actualizarOrden(Number(id), validarDatosOrden(datos));
}
async function eliminar(id) {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) throw new Error('Identificador inválido');
  return repository.eliminarOrden(Number(id));
}
module.exports = { registrar, listar, seguimiento, cambiarEstado, editar, eliminar };
