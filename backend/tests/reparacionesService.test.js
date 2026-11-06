const { crearOrdenReparacion, validarDatosOrden } = require('../src/services/reparacionesService');
const { generarCodigoSeguimiento } = require('../src/utils/generarCodigo');

describe('Pruebas unitarias para crearOrdenReparacion', () => {
  const datosValidos = { nombreCliente: 'Juan Pérez', email: 'juan.perez@example.com', telefono: '1122334455', marca: 'Samsung', modelo: 'Galaxy S21', problemaReportado: 'Pantalla rota y no enciende' };

  test('Caso correcto: crea una orden y genera un código válido', () => {
    const resultado = crearOrdenReparacion(datosValidos, new Date('2026-10-19T12:00:00.000Z'));
    expect(resultado.nombreCliente).toBe('Juan Pérez');
    expect(resultado.email).toBe('juan.perez@example.com');
    expect(resultado.estado).toBe('Ingresado');
    expect(resultado.fechaIngreso).toBe('2026-10-19');
    expect(resultado.fechaSalida).toBeNull();
    expect(resultado.codigoSeguimiento).toMatch(/^REP-[A-Z]{4}-\d{4}$/);
  });

  test('Caso inválido: rechaza un email sin @', () => {
    expect(() => crearOrdenReparacion({ ...datosValidos, email: 'carlos.gomez.com' })).toThrow('Email inválido');
  });

  test('Caso límite: acepta teléfono de ocho caracteres y limpia espacios', () => {
    const resultado = crearOrdenReparacion({ ...datosValidos, nombreCliente: ' Ana María ', telefono: '12345678' });
    expect(resultado.nombreCliente).toBe('Ana María');
    expect(resultado.telefono).toBe('12345678');
    expect(resultado.codigoSeguimiento).toBeDefined();
  });

  test('Rechaza entradas nulas o incompletas', () => {
    expect(() => validarDatosOrden(null)).toThrow('El nombre del cliente es obligatorio');
  });

  test('El generador respeta el formato REP-XXXX-0000', () => {
    expect(generarCodigoSeguimiento()).toMatch(/^REP-[A-Z]{4}-\d{4}$/);
  });
});
