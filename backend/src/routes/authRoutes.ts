import { Router } from 'express';
import { login, register, updateUser } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Rota para registrar um novo usuário
router.post('/register', register);

// Rota para login de usuário
router.post('/login', login);

// Rota para editar usuário
router.put('/edit', authenticateToken, updateUser);

export default router;
