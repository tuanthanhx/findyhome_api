import { body, cookie } from 'express-validator';
import { validateRules } from '../../middlewares/validate.middleware';

const login = [
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
  validateRules,
];

const logout = [];

const refresh = [
  cookie('refreshToken').notEmpty().withMessage('Refresh token is required'),
  validateRules,
];

export default {
  login,
  logout,
  refresh,
};
