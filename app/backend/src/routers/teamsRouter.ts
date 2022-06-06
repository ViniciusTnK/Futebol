import { Router } from 'express';
import teamsController from '../controllers/teamsController';

const router = Router();

router.get('/', teamsController.getall);
router.get('/:id', teamsController.getTeam);

export default router;
