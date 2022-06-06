import { Router } from 'express';
import validateLogin from '../middlewares/validateLogin';
import { loginController } from '../controllers';

const router = Router();

router.post('/', validateLogin, loginController.login);
router.get('/validate', loginController.validate);

export default router;
