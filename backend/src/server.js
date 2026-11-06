require('dotenv').config();
const app = require('./app');
const db = require('./config/db');
const port = Number(process.env.PORT || 4000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('Configurá JWT_SECRET en .env con al menos 24 caracteres.');
  process.exit(1);
}
(async () => {
  try {
    await db.query('SELECT 1');
    app.listen(port, () => console.log(`API disponible en http://localhost:${port}`));
  } catch (error) {
    console.error('No se pudo conectar con MySQL. Revisá las variables DB_*.', error.message);
    process.exit(1);
  }
})();
