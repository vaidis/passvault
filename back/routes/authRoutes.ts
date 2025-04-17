import express from 'express';
import { login, refresh, user, logout } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/user', user);

export const authRouter = router;
