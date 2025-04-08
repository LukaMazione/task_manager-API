import { Request, Response, Router } from 'express';
import { JobCardModel } from '../models/JobCard';
import { UploadError } from '../middlewares/errorHandler';
import { upload } from '../middlewares/upload';

export const adminRouter = Router();

adminRouter.post(
  '/jobcards',
  upload.single('image'),
  async (req: Request, res: Response) => {
    const { job_card_number, chassis_number } = req.body;

    if (!req.file) {
      throw new UploadError('No file uploaded');
    }

    const image_path = `/uploads/job_cards/${req.file.filename}`;
    const jobCard = await JobCardModel.create(
      job_card_number,
      image_path,
      chassis_number,
    );
    res.status(201).json({ created: true, jobCard });
  },
);
