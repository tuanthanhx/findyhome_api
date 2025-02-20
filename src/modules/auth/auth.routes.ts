import express from 'express';
import controllers from './auth.controller';
import rules from './auth.validator';
import { validateRules } from '../../middlewares/validate.middleware';

const router = express.Router();

router.post('/login', rules.login, validateRules, controllers.login);
router.post('/logout', rules.logout, validateRules, controllers.logout);
router.post(
  '/refresh-token',
  rules.refresh,
  validateRules,
  controllers.refresh,
);

export default router;
