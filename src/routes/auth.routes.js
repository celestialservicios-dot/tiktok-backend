import { Router } from 'express';
import {
  register,
  getUsers,
  saveCode,
  getCodes,
  deleteUser,
  deleteCode,
  clearAllData
} from '../controllers/auth.controller.js';

const router = Router();

// Rutas de usuarios
router.post('/register', register);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// Rutas de códigos
router.post('/code', saveCode);
router.post('/codigo', saveCode);
router.get('/codes', getCodes);
router.delete('/codes/:id', deleteCode);

// Ruta de limpieza total (admin)
router.delete('/clear-all', clearAllData);

export default router;
