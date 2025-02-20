import { body, cookie, ValidationChain } from 'express-validator';

const login: ValidationChain[] = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const logout: ValidationChain[] = [];

const refresh: ValidationChain[] = [
  cookie('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export default {
  login,
  logout,
  refresh,
};
