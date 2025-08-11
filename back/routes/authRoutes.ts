import express from 'express';
import { loginUsername, loginAuthproof, refresh, register, logout, user } from '../controllers/authController';

const router = express.Router();

router.post('/login/username', loginUsername);
router.post('/login/authproof', loginAuthproof);
router.post('/refresh', refresh);
router.post('/register/:registerId/', register);
router.get('/user', user);
router.get('/logout', logout);

export const authRouter = router;

