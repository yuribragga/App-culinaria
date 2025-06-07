import { Router } from 'express';
import { saveMealPlan, getMealPlan } from '../controllers/mealplanController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, async (req, res, next) => {
  try {
  await saveMealPlan(req, res, next);
  } catch (err) {
	next(err);
  }
});
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    await getMealPlan(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;