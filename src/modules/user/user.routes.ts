import express from 'express';
import {
  getUsers,
  getUserStats,
  getUserById,
  activateUser,
  deactivateUser,
  createUser,
  updateUser,
  deleteUser,
} from './user.controller';
import { userValidationRules } from './user.validator';

// import { validate } from "../../middlewares/validate.middleware";

const router = express.Router();

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);

router.patch('/:id/deactivate', deactivateUser); // 🆕 Ngừng hoạt động user
router.patch('/:id/activate', activateUser); // 🆕 Hoạt động lại user

router.post("", createUser);         // 🆕 API tạo user
router.put("/:id", updateUser);         // 🆕 API cập nhật user

router.delete('/:id', deleteUser); // 🆕 Xoá user

// router.post("/", userValidationRules, validate, createUser);
router.post('/', createUser);

export default router;
