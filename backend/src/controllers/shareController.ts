import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';

export const shareRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  const { targetUserEmail } = req.body;

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const userRepository = AppDataSource.getRepository(User);

    const recipe = await recipeRepository.findOne({ where: { id: Number(recipeId) }, relations: ['user'] });
    if (!recipe) {
      res.status(404).json({ message: 'Receita não encontrada' });
      return;
    }

    const targetUser = await userRepository.findOne({ where: { email: targetUserEmail } });
    if (!targetUser) {
      res.status(404).json({ message: 'Usuário de destino não encontrado' });
      return;
    }

    res.status(200).json({ message: `Receita compartilhada com ${targetUser.email}` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao compartilhar receita.' });
  }
};

