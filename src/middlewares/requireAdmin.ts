import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from './errorHandler';

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = res.locals.user;
  if (!user) throw new AuthorizationError('User does not exist');
  if (user.role !== 'admin') throw new AuthorizationError('Access denied');
  next();
};
