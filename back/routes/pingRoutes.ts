import express from 'express';
import {getPing} from '../controllers/pingController';

const router = express.Router();

router.get('/', getPing);

export const pingRouter = router;
