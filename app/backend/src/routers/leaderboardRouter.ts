import { Router } from 'express';
import { leaderboardController } from '../controllers';

const router = Router();

router.get('/:place', leaderboardController.getLeaderboard);

export default router;
