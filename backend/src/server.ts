import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rotas de receitas
app.use('/recipes', recipeRoutes);

// Inicializar o banco de dados e iniciar o servidor
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
