import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import dotenv from 'dotenv';
import { recipeImageMiddleware } from './middlewares/uploadMiddleware';
import commentRoutes from './routes/commentRouts';
import mealPlanRoutes from './routes/mealplanRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/recipes', recipeImageMiddleware, recipeRoutes);

app.use('/favorites', favoriteRoutes);

app.use('/comments', commentRoutes);

app.use('/mealplan', mealPlanRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Banco de dados conectado!');
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
