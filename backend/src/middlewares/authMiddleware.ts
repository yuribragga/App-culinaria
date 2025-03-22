import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: {
      id: number;
      email: string;
    };
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token recebido no backend:', token); // Log para verificar o token

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return; // Certifique-se de retornar para evitar que o código continue
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error('Erro ao verificar o token:', err); // Log para verificar erros de validação
      res.status(403).json({ message: 'Token inválido' });
      return; // Certifique-se de retornar para evitar que o código continue
    }

    // Verifica se o payload contém as propriedades esperadas
    if (typeof decoded === 'object' && 'id' in decoded && 'email' in decoded) {
      req.user = {
        id: decoded.id as number,
        email: decoded.email as string,
      };
      console.log('Usuário autenticado:', req.user); // Log para verificar o usuário autenticado
      next(); // Chama o próximo middleware ou manipulador de rota
    } else {
      res.status(403).json({ message: 'Token inválido' });
    }
  });
};