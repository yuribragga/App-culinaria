import { Router } from 'express';
import { createRecipe, listRecipes, getRecipeById, updateRecipe, deleteRecipe, listRecipesByUser  } from '../controllers/recipeController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', listRecipes); 
router.get('/:id', getRecipeById); 

router.post('/create', authenticateToken, createRecipe);
router.put('/:id', authenticateToken, updateRecipe);
router.delete('/:id', authenticateToken, deleteRecipe); 
router.get('/user', authenticateToken, listRecipesByUser);

export default router;
