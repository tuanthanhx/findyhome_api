import express from 'express';
import controllers from './user.controller';
import rules from './user.validator';
import {
  authenticateToken,
  authorizeRole,
} from '../../middlewares/auth.middleware';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole(),
  rules.getUsers,
  controllers.getUsers,
);
router.get(
  '/stats',
  authenticateToken,
  authorizeRole([6]),
  rules.getUserStats,
  controllers.getUserStats,
);
router.get('/:id', rules.getUserById, controllers.getUserById);
router.post('/', rules.createUser, controllers.createUser);
router.put('/:id', rules.updateUser, controllers.updateUser);
router.delete('/:id', rules.deleteUser, controllers.deleteUser);
router.patch('/:id/activate', rules.activateUser, controllers.activateUser);
router.patch(
  '/:id/deactivate',
  rules.deactivateUser,
  controllers.deactivateUser,
);

export default router;
