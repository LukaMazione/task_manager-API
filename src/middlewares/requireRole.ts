import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from './errorHandler';

export const requireRole = (roles: string[] | string) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user;

    if (!user) throw new AuthorizationError('User not authenticated');
    if (!allowedRoles.includes(user.role))
      throw new AuthorizationError('Access denied');

    next();
  };
};
