import { Router } from 'express';
import { createRecipe, listRecipes, getRecipeById, updateRecipe, deleteRecipe } from '../controllers/recipeController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', listRecipes); // Listar todas as receitas
router.get('/:id', getRecipeById); // Buscar receita por ID

// Rotas protegidas (precisam de autenticação)
router.post('/', authenticateToken, createRecipe); // Criar receita
router.put('/:id', authenticateToken, updateRecipe); // Atualizar receita
router.delete('/:id', authenticateToken, deleteRecipe); // Excluir receita

export default router;
