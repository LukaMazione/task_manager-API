import { Router } from 'express';
import { authController } from '../controllers/AuthControler';

export const authRouter = Router();

authRouter.route('/login').post(authController);
