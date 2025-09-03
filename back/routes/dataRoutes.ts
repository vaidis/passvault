import express from 'express';

import { isAuthenticated } from '../middleware/authenticationMiddleware';
import { isAuthorized } from '../middleware/authorizationMiddleware';
import {
  getData,
  deleteData,
  editData,
  addData
} from '../controllers/dataController';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Public routes (just authenticated)
//router.get('/:username', isAuthorized, getData);
router.get('/', getData);
router.post('/add', isAuthorized, addData)
router.post('/edit/:rowId', isAuthorized, editData)
router.delete('/delete/:id', isAuthorized, deleteData)

export const dataRouter = router;

