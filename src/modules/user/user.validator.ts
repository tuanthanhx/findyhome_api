import { query, body, param } from 'express-validator';
import User from './user.model';
import { validateRules } from '../../middlewares/validate.middleware';

const getUsers = [
  query('status')
    .optional()
    .isIn([0, 1])
    .withMessage('status must be either 0 or 1')
    .toInt(),
  query('role')
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage('role must be an integer between 1 and 6')
    .toInt(),
  validateRules,
];

const getUserStats = [];

const getUserById = [
  param('id').isMongoId().withMessage('Invalid MongoDB ID'),
  validateRules,
];

const createUser = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email: string) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already exists');
    }),
  body('username')
    .optional()
    .custom(async (username: string) => {
      if (!username) return true;
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error('Username already exists');
    })
    .trim()
    .escape(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role').optional().isInt({ min: 1, max: 6 }).withMessage('Invalid role'),
  body('status')
    .isIn([0, 1])
    .withMessage('Status must be either 0 or 1')
    .toInt(),
  body('referrerId')
    .optional()
    .isInt()
    .withMessage('ReferrerId ID must be a number')
    .custom(async (referrerId: number) => {
      const referrerExists = await User.exists({ referralId: referrerId });
      if (!Boolean(referrerExists))
        throw new Error('Referrer with that ID does not exist');
    }),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('name').optional().isString(),
  body('dob').optional().isISO8601().withMessage('Invalid date of birth'),
  body('nationalId')
    .optional()
    .isString()
    .custom(async (nationalId: string) => {
      if (!nationalId) return true;
      const existingUser = await User.findOne({ nationalId });
      if (existingUser) throw new Error('National ID already exists');
    }),
  body('phone')
    .optional()
    .isString()
    .custom(async (phone: string) => {
      if (!phone) return true;
      const existingUser = await User.findOne({ phone });
      if (existingUser) throw new Error('Phone number already exists');
    }),
  body('address').optional().isString(),
  body('baseSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Invalid base salary'),
  body('bankAccount.bankName').optional().isString(),
  body('bankAccount.branch').optional().isString(),
  body('bankAccount.accountNumber')
    .optional()
    .isString()
    .custom(async (accountNumber: string) => {
      if (!accountNumber) return true;
      const existingUser = await User.findOne({
        'bankAccount.accountNumber': accountNumber,
      });
      if (existingUser) throw new Error('Bank account number already exists');
    }),
  body('socialProfile.facebook')
    .optional()
    .isURL()
    .withMessage('Invalid Facebook URL'),
  body('socialProfile.tiktok')
    .optional()
    .isURL()
    .withMessage('Invalid TikTok URL'),
  body('bio').optional().isString(),
  validateRules,
];

const updateUser = [
  param('id').isMongoId().withMessage('Invalid MongoDB ID'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email, { req }: { req: Request }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== req.params.id) {
        throw new Error('Email already exists');
      }
    }),
  body('username')
    .optional()
    .custom(async (username: string, { req }: { req: Request }) => {
      if (!username) return true;
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.id !== req.params.id) {
        throw new Error('Username already exists');
      }
    })
    .trim()
    .escape(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role').optional().isInt({ min: 1, max: 6 }).withMessage('Invalid role'),
  body('status')
    .isIn([0, 1])
    .withMessage('Status must be either 0 or 1')
    .toInt(),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('name').optional().isString(),
  body('dob').optional().isISO8601().withMessage('Invalid date of birth'),
  body('nationalId')
    .optional()
    .isString()
    .custom(async (nationalId: string, { req }: { req: Request }) => {
      if (!nationalId) return true;
      const existingUser = await User.findOne({ nationalId });
      if (existingUser && existingUser.id !== req.params.id) {
        throw new Error('National ID already exists');
      }
    }),
  body('phone')
    .optional()
    .isString()
    .custom(async (phone: string, { req }: { req: Request }) => {
      if (!phone) return true;
      const existingUser = await User.findOne({ phone });
      if (existingUser && existingUser.id !== req.params.id) {
        throw new Error('Phone number already exists');
      }
    }),

  body('address').optional().isString(),
  body('baseSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Invalid base salary'),
  body('bankAccount.bankName').optional().isString(),
  body('bankAccount.branch').optional().isString(),
  body('bankAccount.accountNumber')
    .optional()
    .isString()
    .custom(async (accountNumber: string, { req }: { req: Request }) => {
      if (!accountNumber) return true;
      const existingUser = await User.findOne({
        'bankAccount.accountNumber': accountNumber,
      });
      if (existingUser && existingUser.id !== req.params.id) {
        throw new Error('Bank account number already exists');
      }
    }),
  body('socialProfile.facebook')
    .optional()
    .isURL()
    .withMessage('Invalid Facebook URL'),
  body('socialProfile.tiktok')
    .optional()
    .isURL()
    .withMessage('Invalid TikTok URL'),
  body('bio').optional().isString(),
  validateRules,
];

const deleteUser = [
  param('id').isMongoId().withMessage('Invalid MongoDB ID'),
  validateRules,
];

const activateUser = [
  param('id').isMongoId().withMessage('Invalid MongoDB ID'),
  validateRules,
];

const deactivateUser = [
  param('id').isMongoId().withMessage('Invalid MongoDB ID'),
  validateRules,
];

export default {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
};
