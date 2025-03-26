import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwtDecode from 'jwt-decode'; // Importação como default

declare module 'express' {
  export interface Request {
    user?: {
      id: number;
      email: string;
    };
  }
}


const getUserIdFromToken = (token: string): number | null => {
  try {
    const decoded: any = jwtDecode(token); // Decodifica o token corretamente
    return decoded.id || null; // Certifique-se de que o campo `id` está presente no token
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token recebido no backend:', token); // Log para verificar o token

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error('Erro ao verificar o token:', err); // Log para verificar erros de validação
      res.status(403).json({ message: 'Token inválido' });
      return;
    }

    console.log('Decoded token:', decoded); // 🔍 Veja se o `id` está correto

    if (typeof decoded === 'object' && 'id' in decoded) {
      const userId = Number(decoded.id);
      if (isNaN(userId)) {
        res.status(403).json({ message: 'ID do usuário no token é inválido' });
        return;
      }

      req.user = { id: userId, email: (decoded as JwtPayload).email }; // Adiciona o userId e email ao req.user
      next();
    } else {
      console.error('Erro: Payload do token não contém um ID válido', decoded);
      res.status(403).json({ message: 'Token inválido' });
    }
  });
};
