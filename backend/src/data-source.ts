import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Recipe } from './entities/Recipe';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: true,
  entities: [User, Recipe],
  migrations: [],
  subscribers: [],
});
