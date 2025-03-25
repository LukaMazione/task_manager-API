import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export class DatabaseError extends Error {}
export class UploadError extends Error {}
export class FileUploadError extends Error {}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof DatabaseError) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (error instanceof UploadError) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof FileUploadError) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: 'An unexpected error occurred' });
};
