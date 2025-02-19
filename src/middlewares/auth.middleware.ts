import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};

export const authorizeRole = (roles: number[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as any;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (roles.length === 0 || roles.includes(user.roles[0])) {
      return next();
    }

    return res
      .status(403)
      .json({ message: 'Forbidden - You do not have permission' });
  };
};

export default { authenticateToken, authorizeRole };
