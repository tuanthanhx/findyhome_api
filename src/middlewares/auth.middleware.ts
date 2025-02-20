import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface UserPayload {
  id: string;
  roles: number[];
  iat?: number;
  exp?: number;
}

export const authenticateToken = (roles: number[] = []) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized - No token provided' });
      return;
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden - Invalid token' });
        return;
      }

      const userPayload = decoded as UserPayload;

      console.log(userPayload);

      req.user = userPayload;

      if (roles.length === 0 || roles.includes(userPayload?.roles[0])) {
        next();
        return;
      }

      return res
        .status(403)
        .json({ message: 'Forbidden - You do not have permission' });
    });
  };
};

export default { authenticateToken };
