import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';
import { Ingredient } from '../entities/Ingredient'; // Importe a entidade Ingredient

export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, ingredients, instructions, time, servings, image, classification } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    if (!classification) {
      res.status(400).json({ message: 'Classificação é obrigatória' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);
    const ingredientRepository = AppDataSource.getRepository(Ingredient);

    // Cria a receita
    const newRecipe = recipeRepository.create({
      name,
      description,
      instructions: Array.isArray(instructions) ? instructions : instructions.split('\n'), // Certifique-se de que é um array
      time,
      servings,
      image,
      classification,
      user: { id: userId },
    });

    const savedRecipe = await recipeRepository.save(newRecipe);

    // Salva os ingredientes vinculados à receita
    if (Array.isArray(ingredients)) {
      const ingredientEntities = ingredients.map((ingredient: { name: string; quantity: number; unit: string }) =>
        ingredientRepository.create({
          name: ingredient.name,
          quantity: String(ingredient.quantity),
          unit: ingredient.unit,
          recipe: savedRecipe,
        })
      );

      await ingredientRepository.save(ingredientEntities);
    }

    res.status(201).json({ message: 'Receita criada com sucesso', recipe: savedRecipe });
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
      relations: ['ingredients','user'], 
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
    const ingredientRepository = AppDataSource.getRepository(Ingredient);

    // Busca a receita existente
    const recipe = await recipeRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['ingredients'], // Inclui os ingredientes existentes
    });

    if (!recipe) {
      res.status(404).json({ message: 'Receita não encontrada' });
      return;
    }

    // Atualiza os campos da receita
    recipe.name = name || recipe.name;
    recipe.description = description || recipe.description;
    recipe.instructions = instructions || recipe.instructions;
    recipe.time = time || recipe.time;
    recipe.servings = servings || recipe.servings;
    recipe.image = image || recipe.image;

    // Remove os ingredientes antigos
    await ingredientRepository.delete({ recipe: { id: recipe.id } });

    // Adiciona os novos ingredientes
    if (Array.isArray(ingredients)) {
      const newIngredients = ingredients.map((ingredient: { name: string; quantity: string; unit: string }) =>
        ingredientRepository.create({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          recipe,
        })
      );

      await ingredientRepository.save(newIngredients);
    }

    // Salva a receita atualizada
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

    if (isNaN(userId)) {
      res.status(400).json({ message: 'ID do usuário inválido' });
      return;
    }

    const recipeRepository = AppDataSource.getRepository(Recipe);

    const recipes = await recipeRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
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


