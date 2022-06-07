import { Router } from 'express';
import validateMatch from '../middlewares/validateMatch';
import { matchesController } from '../controllers';

const router = Router();

router.get('/', matchesController.getall);
router.post('/', validateMatch, matchesController.createMatch);

export default router;
