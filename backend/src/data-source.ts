import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Recipe } from './entities/Recipe';
import { Ingredient } from './entities/Ingredient';
import { Comment } from './entities/comments';
import { Rating } from './entities/Rating'; 
import { MealPlan } from './entities/MealPlan';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: true,
  entities: [User,Ingredient, Recipe, Comment, Rating, MealPlan], 
  migrations: [],
  subscribers: [],
});
