import express from 'express';
import { login, refresh, user, logout } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/logout', logout);

export const authRouter = router;
