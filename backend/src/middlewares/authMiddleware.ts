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

  console.log('Token recebido no backend:', token);
  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error('Erro ao verificar o token:', err);
      res.status(403).json({ message: 'Token inválido' });
      return;
    }

    console.log('Decoded token:', decoded);

    if (typeof decoded === 'object' && 'id' in decoded) {
      const userId = Number(decoded.id);
      if (isNaN(userId)) {
        res.status(403).json({ message: 'ID do usuário no token é inválido' });
        return;
      }

      req.user = { id: userId, email: (decoded as JwtPayload).email };
      next();
    } else {
      console.error('Erro: Payload do token não contém um ID válido', decoded);
      res.status(403).json({ message: 'Token inválido' });
    }
  });
};
