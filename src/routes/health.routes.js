import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// Ruta de estado de la API y de la base de datos
router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbTimestamp = null;

  try {
    const result = await query('SELECT NOW() as now');
    dbStatus = 'connected';
    dbTimestamp = result.rows[0].now;
  } catch (error) {
    dbStatus = `error: ${error.message}`;
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      timestamp: dbTimestamp
    }
  });
});

export default router;
