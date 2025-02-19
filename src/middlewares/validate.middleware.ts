import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';

export const validateRules = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const handleQueries = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('limit must be a positive integer'),
  query('sortField').optional().trim().escape(),
  query('sortOrder').optional().trim().escape(),
  query('keyword').optional().trim().escape(),
];
