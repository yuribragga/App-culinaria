import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { addComment, getCommentsByRecipe } from '../controllers/commentController';

const router = Router();

router.post('/comments', authenticateToken ,addComment);
router.get('/recipe/:recipeId/comments', getCommentsByRecipe);

export default router;