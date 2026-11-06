const service = require('../services/reparacionesAppService');

async function registrar(req, res, next) {
  try { const data = await service.registrar(req.body); return res.status(201).json({ mensaje: 'Orden creada exitosamente', data }); }
  catch (error) { return next(error); }
}
async function listar(req, res, next) {
  try { const data = await service.listar({ cliente: req.query.cliente, estado: req.query.estado, modelo: req.query.modelo }); return res.json({ data }); }
  catch (error) { return next(error); }
}
async function seguimiento(req, res, next) {
  try {
    const data = await service.seguimiento(req.params.codigo);
    if (!data) return res.status(404).json({ error: 'No se encontró una reparación con ese código' });
    return res.json({ data: { codigoSeguimiento: data.codigo_seguimiento, marca: data.marca, modelo: data.modelo, estado: data.estado, fechaIngreso: data.fecha_ingreso, fechaSalida: data.fecha_salida } });
  } catch (error) { return next(error); }
}
async function cambiarEstado(req, res, next) {
  try { const data = await service.cambiarEstado(req.params.id, req.body.estado); if (!data) return res.status(404).json({ error: 'Orden no encontrada' }); return res.json({ mensaje: 'Estado actualizado', data }); }
  catch (error) { return next(error); }
}
async function editar(req, res, next) {
  try { const data = await service.editar(req.params.id, req.body); if (!data) return res.status(404).json({ error: 'Orden no encontrada' }); return res.json({ mensaje: 'Orden actualizada', data }); }
  catch (error) { return next(error); }
}
async function eliminar(req, res, next) {
  try { const ok = await service.eliminar(req.params.id); if (!ok) return res.status(404).json({ error: 'Orden no encontrada' }); return res.json({ mensaje: 'Orden eliminada' }); }
  catch (error) { return next(error); }
}
module.exports = { registrar, listar, seguimiento, cambiarEstado, editar, eliminar };
