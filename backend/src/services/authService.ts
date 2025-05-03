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

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User();
  newUser.email = email;
  newUser.password = hashedPassword;

  const savedUser = await AppDataSource.getRepository(User).save(newUser);
  return savedUser;
};


export const loginUser = async (email: string, password: string): Promise<string> => {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  };
