import { Request, Response } from 'express';
import {
  AuthenticationError,
  ValidationError,
} from '../middlewares/errorHandler';

import { UserModel } from '../models/UserModel';

export interface LoginRequestBody {
  username: string;
  password: string;
}

export const authController = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response,
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password)
    throw new ValidationError('Missing username and/or password');

  const user = await UserModel.findByUsername(username);

  if (!user || !(await user.verifyPassword(password)))
    throw new AuthenticationError('Wrong credentials');

  res.locals.user = user;

  res
    .status(200)
    .json({ id: user.id, username: user.username, role: user.role });
};
