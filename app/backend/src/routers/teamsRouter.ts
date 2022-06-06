import { Router } from 'express';
import teamsController from '../controllers/teamsController';

const router = Router();

router.get('/', teamsController.getall);

export default router;
