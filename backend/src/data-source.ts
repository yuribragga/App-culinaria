import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Recipe } from './entities/Recipe';
import { Ingredient } from './entities/Ingredient';
import { Comment } from './entities/comments'; // Import da entidade Comment

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: true,
  entities: [User,Ingredient, Recipe, Comment],
  migrations: [],
  subscribers: [],
});
