import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { MealPlan } from '../entities/MealPlan';

export const saveMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request.' });
    }
    const userId = req.user.id;
    const { week } = req.body;
    let mealPlan = await AppDataSource.getRepository(MealPlan).findOneBy({ userId });
    if (mealPlan) {
      mealPlan.week = week;
    } else {
      mealPlan = AppDataSource.getRepository(MealPlan).create({ userId, week });
    }
    await AppDataSource.getRepository(MealPlan).save(mealPlan);
    res.status(200).json(mealPlan); // Não use return aqui!
  } catch (err) {
    next(err);
  }
};
export const getMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request.' });
    }
    const userId = req.user.id;
    const mealPlan = await AppDataSource.getRepository(MealPlan).findOneBy({ userId });
    res.json(mealPlan); // Não use return aqui!
  } catch (err) {
    next(err);
  }
};