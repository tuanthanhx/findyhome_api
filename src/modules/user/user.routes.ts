import express from 'express';
import controllers from './user.controller';
import { userValidationRules } from './user.validator';
import rules from './user.validator';

// import { validate } from '../../middlewares/validate.middleware';
import rules from './user.validator';

const router = express.Router();

router.get('/', rules.getUsers, controllers.getUsers);
router.get('/stats', rules.getUserStats, controllers.getUserStats);
router.get('/:id', rules.getUserById, controllers.getUserById);
router.post('/', rules.createUser, controllers.createUser);


router.put('/:id', rules.updateUser, controllers.updateUser);         // 🆕 API cập nhật user



router.delete('/:id', rules.deleteUser, controllers.deleteUser);
router.patch('/:id/activate', rules.activateUser, controllers.activateUser);
router.patch('/:id/deactivate', rules.deactivateUser, controllers.deactivateUser);

export default router;
