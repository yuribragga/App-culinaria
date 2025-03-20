import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/recipes', recipeRoutes);

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
