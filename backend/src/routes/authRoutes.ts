import { Router } from 'express';
import { login, register, updateUser } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();


router.post('/register', register);

router.post('/login', login);

router.put('/edit', authenticateToken, updateUser);

export default router;
