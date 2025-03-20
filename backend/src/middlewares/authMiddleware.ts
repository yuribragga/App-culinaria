import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estender a interface Request diretamente no arquivo
declare module 'express' {
  export interface Request {
    user?: {
      id: number;
      email: string;
    };
  }
}

const SECRET_KEY = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    req.user = decoded; // Adiciona os dados do token ao objeto `req`
    next(); // Chama o próximo middleware ou controlador
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
    return;
  }
};