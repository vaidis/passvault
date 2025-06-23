import express from 'express';
import { login, refresh, logout } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/logout', logout);

export const authRouter = router;
