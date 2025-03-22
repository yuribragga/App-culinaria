import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Recipe } from '../entities/Recipe';

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { recipeId } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const recipeRepository = AppDataSource.getRepository(Recipe);

    const user = await userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });
    const recipe = await recipeRepository.findOne({ where: { id: recipeId } });

    if (!user || !recipe) {
      res.status(404).json({ message: 'Usuário ou receita não encontrados' });
      return;
    }

    user.favorites.push(recipe);
    await userRepository.save(user);

    res.status(200).json({ message: 'Receita adicionada aos favoritos', favorites: user.favorites });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { recipeId } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    user.favorites = user.favorites.filter((recipe) => recipe.id !== recipeId);
    await userRepository.save(user);

    res.status(200).json({ message: 'Receita removida dos favoritos', favorites: user.favorites });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const listFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};