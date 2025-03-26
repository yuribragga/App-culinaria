import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';


export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, ingredients, instructions, time, servings, image } = req.body;
    const userId = req.user?.id; // Obtém o ID do usuário autenticado do middleware `authenticateToken`

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);

    const newRecipe = recipeRepository.create({
      name,
      description,
      ingredients,
      instructions,
      time,
      servings,
      image,
      user: { id: userId },
    });

    await recipeRepository.save(newRecipe);

    res.status(201).json({ message: 'Receita criada com sucesso', recipe: newRecipe });
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const listRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipes = await recipeRepository.find();
    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Erro ao listar receitas:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const searchRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ message: 'Parâmetro de busca é obrigatório' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipes = await recipeRepository.find({
      where: [
        { name: `%${query}%` },
        { description: `%${query}%` },
      ],
    });

    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recipeRepository = AppDataSource.getRepository(Recipe);

    const recipe = await recipeRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'], // Inclui os dados do autor da receita
    });

    if (!recipe) {
      res.status(404).json({ message: 'Receita não encontrada' });
      return;
    }

    res.status(200).json({ recipe });
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, instructions, time, servings, image } = req.body;

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!recipe) {
      res.status(404).json({ message: 'Receita não encontrada' });
      return;
    }

    recipe.name = name || recipe.name;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.time = time || recipe.time;
    recipe.servings = servings || recipe.servings;
    recipe.image = image || recipe.image;

    await recipeRepository.save(recipe);

    res.status(200).json({ message: 'Receita atualizada com sucesso', recipe });
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!recipe) {
      res.status(404).json({ message: 'Receita não encontrada' });
      return;
    }

    await recipeRepository.remove(recipe);

    res.status(200).json({ message: 'Receita excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};




export const getRecipesByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    console.log('ID do usuário recebido:', req.params.id);
    console.log('ID convertido para número:', Number(req.params.id));

    // Valida e converte o ID para número
    if (isNaN(userId)) {
      res.status(400).json({ message: 'ID do usuário inválido' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);

    const recipes = await recipeRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], // Inclui os dados do autor da receita
    });

    if (recipes.length === 0) {
      res.status(404).json({ message: 'Nenhuma receita encontrada para este usuário' });
      return;
    }

    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Erro ao buscar receitas por ID do usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


