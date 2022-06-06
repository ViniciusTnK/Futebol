import { Router } from 'express';
import { teamsController } from '../controllers';

const router = Router();

router.get('/', teamsController.getall);
router.get('/:id', teamsController.getTeam);

export default router;
