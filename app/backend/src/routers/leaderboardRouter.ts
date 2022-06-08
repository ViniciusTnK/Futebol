import { Router } from 'express';
import { leaderboardController } from '../controllers';

const router = Router();

router.get('/', leaderboardController.getLeaderboard);
router.get('/:place', leaderboardController.getLeaderboardByPlace);

export default router;
