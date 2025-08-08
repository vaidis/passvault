import express from 'express';
import { login, refresh, register, logout, user } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/register/:registerId/', register);
router.get('/user', user);
router.get('/logout', logout);

export const authRouter = router;

