import 'dotenv/config';
import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
  console.log(`📡 Ruta de salud: http://localhost:${PORT}/api/health`);

  // Probar la conexión a la base de datos PostgreSQL
  await testConnection();
});
