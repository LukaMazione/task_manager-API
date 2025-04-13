import { Router } from 'express';
import { requireRole } from '../middlewares/requireRole';

export const adminRouter = Router();

adminRouter.use(requireRole('admin'));
