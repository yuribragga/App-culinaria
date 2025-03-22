import { Router } from 'express';
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favoriteController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authenticateToken, addFavorite);
router.post('/remove', authenticateToken, removeFavorite);
router.get('/list', authenticateToken, listFavorites);

export default router;