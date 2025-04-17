import express from 'express';
import { isAuthenticated } from '../middleware/authenticationMiddleware';
import { isAuthorized } from '../middleware/authorizationMiddleware';
import {
  getAllData,
  //getUserById,
  //updateUser,
  //deleteUser
} from '../controllers/userController';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Public routes (just authenticated)
router.get('/:id', isAuthorized, getAllData);

// Protected routes (authenticated + authorized)
//router.get('/:id', isAuthorized, getUserById);
//router.put('/:id', isAuthorized, updateUser);
//router.delete('/:id', isAuthorized, deleteUser);

export const userRouter = router;
