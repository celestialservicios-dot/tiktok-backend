import { Router } from 'express';
import {
  register,
  getUsers,
  updateUserStatus,
  getUserStatusById,
  saveCode,
  getCodes,
  updateCodeStatus,
  getCodeStatusById,
  getLatestCodeStatus,
  deleteUser,
  deleteCode,
  clearAllData
} from '../controllers/auth.controller.js';

const router = Router();

// Rutas de usuarios
router.post('/register', register);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);
router.get('/users/:id/status', getUserStatusById);
router.get('/user/:id/status', getUserStatusById);

// Rutas de códigos
router.post('/code', saveCode);
router.post('/codigo', saveCode);
router.get('/codes', getCodes);
router.delete('/codes/:id', deleteCode);

// Rutas de validación de códigos en tiempo real (Nube)
router.patch('/codes/:id/status', updateCodeStatus);
router.put('/codes/:id/status', updateCodeStatus);
router.get('/codes/:id/status', getCodeStatusById);
router.get('/code/:id/status', getCodeStatusById);
router.get('/code/latest/:userId', getLatestCodeStatus);

// Ruta de limpieza total (admin)
router.delete('/clear-all', clearAllData);

export default router;
