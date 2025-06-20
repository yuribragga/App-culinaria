import { Router } from 'express';
import { createRecipe, listRecipes, getRecipeById, updateRecipe, deleteRecipe,  getRecipesByUserId, addRating, getRecipeRatings } from '../controllers/recipeController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { shareRecipe } from '../controllers/shareController';
import multer from 'multer';

const upload = multer();
const router = Router();

router.get('/', listRecipes); 
router.get('/:id', getRecipeById); 

router.post('/create', authenticateToken, upload.single('image'), createRecipe);
router.put('/:id', authenticateToken, upload.single('image'), updateRecipe);
router.delete('/:id', authenticateToken, deleteRecipe); 
router.get('/user/:id', authenticateToken, getRecipesByUserId);
router.post('/:recipeId/share', shareRecipe);

router.post('/:recipeId/ratings', authenticateToken, async (req, res, next) => {
  try {
	await addRating(req, res);
  } catch (err) {
	next(err);
  }
});
router.get('/:recipeId/ratings', async (req, res, next) => {
  try {
    await getRecipeRatings(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
