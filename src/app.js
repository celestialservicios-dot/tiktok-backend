import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API con Express y Node.js',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      users: 'GET /api/auth/users'
    }
  });
});

// Rutas de la API
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.originalUrl} no existe.`
  });
});

// Manejo centralizado de errores (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Ha ocurrido un error inesperado en el servidor.'
  });
});

export default app;
