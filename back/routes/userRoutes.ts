import express from 'express';

import { isAuthenticated } from '../middleware/authenticationMiddleware';
import { isAuthorized } from '../middleware/authorizationMiddleware';
import {
  getProfile,
  setProfile
} from '../controllers/userController';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Public routes (just authenticated)
router.get('/:username/profile', isAuthorized, getProfile);
router.post('/:username/profile', isAuthorized, setProfile)

export const userRouter = router;


