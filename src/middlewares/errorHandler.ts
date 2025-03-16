import { Request, Response, NextFunction } from 'express';

export class DatabaseError extends Error {}

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
  res.status(500).json({ error: 'An unexpected error occurred' });
};
