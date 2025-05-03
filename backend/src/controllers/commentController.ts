import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../entities/comments';
import { Recipe } from '../entities/Recipe';
import { User } from '../entities/User';

// Adicionar um comentário
export const addComment = async (req: Request, res: Response): Promise<void> => {
  const { recipeId, userId, text } = req.body;

  try {
    const recipe = await AppDataSource.getRepository(Recipe).findOne({ where: { id: recipeId } });
    const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });

    if (!recipe || !user) {
      res.status(404).json({ message: 'Receita ou usuário não encontrado' });
      return;
    }

    const comment = AppDataSource.getRepository(Comment).create({
      text,
      recipe,
      user,
    });

    await AppDataSource.getRepository(Comment).save(comment);

    res.status(201).json({ message: 'Comentário adicionado com sucesso', comment });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


export const getCommentsByRecipe = async (req: Request, res: Response): Promise<void> => {
  const { recipeId } = req.params;



  try {
    const comments = await AppDataSource.getRepository(Comment).find({
      where: { recipe: { id: parseInt(recipeId, 10) } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};