import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const authenticateToken = (roles: number[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No token provided' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden - Invalid token' });
      }

      req.user = decoded;

      if (roles.length === 0 || roles.includes(decoded.roles[0])) {
        return next();
      }

      return res
        .status(403)
        .json({ message: 'Forbidden - You do not have permission' });
    });
  };
};

export default { authenticateToken };
