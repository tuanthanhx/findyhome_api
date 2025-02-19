import express from 'express';
import controllers from './auth.controller';
import rules from './auth.validator';

const router = express.Router();

router.post('/login', rules.login, controllers.login);
router.post('/logout', rules.logout, controllers.logout);
router.post('/refresh-token', rules.refresh, controllers.refresh);

export default router;
