import { Router } from 'express';
import { matchesController } from '../controllers';

const router = Router();

router.get('/', matchesController.getall);

export default router;
