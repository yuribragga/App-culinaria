import { Router } from 'express';
import { login, register, updateUser } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { userImageMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();


router.post('/register', userImageMiddleware,register);

router.post('/login', login);

router.put('/edit/:userId', authenticateToken, updateUser);

export default router;
