const db = require('../config/db');

async function guardarOrden(orden) {
  // La restricción UNIQUE de MySQL es la garantía final contra códigos duplicados.
  for (let intento = 0; intento < 5; intento += 1) {
    try {
      const [result] = await db.execute(
        `INSERT INTO reparaciones
        (nombre_cliente,email,telefono,marca,modelo,problema_reportado,estado,fecha_ingreso,fecha_salida,codigo_seguimiento)
        VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [orden.nombreCliente, orden.email, orden.telefono, orden.marca, orden.modelo,
          orden.problemaReportado, orden.estado, orden.fechaIngreso, orden.fechaSalida, orden.codigoSeguimiento]
      );
      return { id: result.insertId, ...orden };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && intento < 4) {
        const { generarCodigoSeguimiento } = require('../utils/generarCodigo');
        orden.codigoSeguimiento = generarCodigoSeguimiento();
        continue;
      }
      throw error;
    }
  }
}

async function listarOrdenes(filtros = {}) {
  const condiciones = [];
  const valores = [];
  if (filtros.cliente) { condiciones.push('nombre_cliente LIKE ?'); valores.push(`%${filtros.cliente}%`); }
  if (filtros.estado) { condiciones.push('estado = ?'); valores.push(filtros.estado); }
  if (filtros.modelo) { condiciones.push('modelo LIKE ?'); valores.push(`%${filtros.modelo}%`); }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const [rows] = await db.execute(`SELECT * FROM reparaciones ${where} ORDER BY creado_en DESC`, valores);
  return rows;
}

async function buscarPorCodigo(codigo) {
  const [rows] = await db.execute('SELECT * FROM reparaciones WHERE codigo_seguimiento = ?', [codigo]);
  return rows[0] || null;
}

async function buscarPorId(id) {
  const [rows] = await db.execute('SELECT * FROM reparaciones WHERE id = ?', [id]);
  return rows[0] || null;
}

async function actualizarEstado(id, estado) {
  const fechaSalida = estado === 'Entregado' ? new Date().toISOString().slice(0, 10) : null;
  const [result] = await db.execute(
    'UPDATE reparaciones SET estado = ?, fecha_salida = ? WHERE id = ?', [estado, fechaSalida, id]
  );
  return result.affectedRows ? buscarPorId(id) : null;
}

async function actualizarOrden(id, datos) {
  const [result] = await db.execute(
    `UPDATE reparaciones SET nombre_cliente=?, email=?, telefono=?, marca=?, modelo=?, problema_reportado=? WHERE id=?`,
    [datos.nombreCliente, datos.email, datos.telefono, datos.marca, datos.modelo, datos.problemaReportado, id]
  );
  return result.affectedRows ? buscarPorId(id) : null;
}

async function eliminarOrden(id) {
  const [result] = await db.execute('DELETE FROM reparaciones WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { guardarOrden, listarOrdenes, buscarPorCodigo, buscarPorId, actualizarEstado, actualizarOrden, eliminarOrden };
