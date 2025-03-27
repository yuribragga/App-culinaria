import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppDataSource } from '../data-source'; 
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;


export const registerUser = async (email: string, password: string): Promise<User> => {
 
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  // Verifica se o usuário já existe
  const existingUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Usuário já existe');
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria um novo usuário
  const newUser = new User();
  newUser.email = email;
  newUser.password = hashedPassword;

  // Salva o usuário no banco de dados
  const savedUser = await AppDataSource.getRepository(User).save(newUser);
  return savedUser; // Retorna o usuário salvo com o ID gerado automaticamente
};

// Função para fazer login do usuário
export const loginUser = async (email: string, password: string): Promise<string> => {
  // Verifica se os campos estão vazios
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  // Procura o usuário no banco de dados
  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verifica se a senha é válida
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Senha inválida');
  }

  // Gera um token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  };
