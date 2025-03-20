import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: {
      id: number;
      email: string;
    };
  }
}

const SECRET_KEY = process.env.JWT_SECRET || '';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
    return;
  }
};