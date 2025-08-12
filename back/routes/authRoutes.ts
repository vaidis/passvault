import express from 'express';
import { loginStart, loginFinish, refresh, register, logout, user } from '../controllers/authController';

const router = express.Router();

router.post('/login/start', loginStart);
router.post('/login/finish', loginFinish);
router.post('/refresh', refresh);
router.post('/register/:registerId/', register);
router.get('/user', user);
router.get('/logout', logout);

export const authRouter = router;

