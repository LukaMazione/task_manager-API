import { Router } from 'express';
import { JobCardModel } from '../models/jobCard';

export const adminRouter = Router();

adminRouter.post('/jobcards', async (req, res) => {
  const { job_card_number, image_path, chassis_number } = req.body;
  const jobCard = await JobCardModel.create(
    job_card_number,
    chassis_number,
    image_path,
  );
  res.status(201).json({ id: jobCard, created: 'succcessfully' });
});
