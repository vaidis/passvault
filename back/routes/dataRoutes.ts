import express from 'express';

import { isAuthenticated } from '../middleware/authenticationMiddleware';
import { isAuthorized } from '../middleware/authorizationMiddleware';
import {
  getData,
  deleteData,
  editData,
  newData
} from '../controllers/dataController';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Public routes (just authenticated)
//router.get('/:username', isAuthorized, getData);
router.get('/', getData);
router.post('/:username/new', isAuthorized, newData)
router.post('/:username/edit/:rowId', isAuthorized, editData)
router.post('/:username/delete/:row', isAuthorized, deleteData)

export const dataRouter = router;

