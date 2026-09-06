import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

// Si usas DATABASE_URL (Opción B)
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
    // O si usas variables individuales (Opción A)
    : new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
    });

// Función auxiliar para realizar consultas fácilmente

// Manejador para evitar caídas por desconexión en clientes inactivos de la base de datos
pool.on('error', (err) => {
  console.error('Aviso: Error en cliente inactivo de PostgreSQL (reconectando automáticamente):', err.message);
});

export const query = (text, params) => pool.query(text, params);

// Verificar la conexión
export const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Conexión a PostgreSQL exitosa:', res.rows[0].now);
        return true;
    } catch (error) {
        const detail = error.code ? `${error.code} (${error.message || 'Sin conexión'})` : (error.message || error);
        console.error('❌ Error al conectar a PostgreSQL:', detail);
        return false;
    }
};

export default pool;
