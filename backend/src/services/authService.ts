import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = 'seu_segredo_jwt';

export const registerUser = async (email: string, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = { id: Date.now().toString(), email, password: hashedPassword };
  return user;
};

export const loginUser = async (email: string, password: string, user: User): Promise<string> => {
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Senha inválida');
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};