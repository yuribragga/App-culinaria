import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';

export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, ingredients, instructions, time, servings, image } = req.body;

   
    if (!name || !description || !ingredients || !instructions || !time || !servings) {
      res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      return;
    }

    // Obter o usuário autenticado (a partir do token JWT)
    const userId = req.user?.id; // `req.user` é preenchido pelo `authMiddleware`
    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
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
      user,
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

    // Busca a receita pelo ID
    const recipe = await recipeRepository.findOne({ where: { id: parseInt(id, 10) } });

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
