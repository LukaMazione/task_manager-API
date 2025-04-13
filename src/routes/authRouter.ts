import { Router } from 'express';
import { authController } from '../controllers/AuthController';

export const authRouter = Router();

authRouter.route('/login').post(authController);
