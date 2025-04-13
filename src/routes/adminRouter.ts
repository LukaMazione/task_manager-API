import { Router } from 'express';
import { requireAdmin } from '../middlewares/requireAdmin';

export const adminRouter = Router();

adminRouter.use(requireAdmin);
