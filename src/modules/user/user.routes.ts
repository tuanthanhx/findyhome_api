import express from 'express';
import controllers from './user.controller';
import rules from './user.validator';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateRules } from '../../middlewares/validate.middleware';

const router = express.Router();

router.get('/', authenticateToken(), rules.getUsers, controllers.getUsers);
router.get(
  '/stats',
  authenticateToken([2]),
  rules.getUserStats,
  controllers.getUserStats,
);
router.get('/:id', rules.getUserById, validateRules, controllers.getUserById);
router.post('/', rules.createUser, validateRules, controllers.createUser);
router.put('/:id', rules.updateUser, validateRules, controllers.updateUser);
router.delete('/:id', rules.deleteUser, validateRules, controllers.deleteUser);
router.patch(
  '/:id/activate',
  rules.activateUser,
  validateRules,
  controllers.activateUser,
);
router.patch(
  '/:id/deactivate',
  rules.deactivateUser,
  controllers.deactivateUser,
);

export default router;
