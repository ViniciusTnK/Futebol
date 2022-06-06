import { Router } from 'express';
import validateLogin from '../middlewares/validateLogin';
import loginController from '../controllers/loginController';

const router = Router();

router.post('/', validateLogin, loginController.login);

export default router;
