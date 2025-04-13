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
  if (!user) throw new AuthenticationError(`user: ${username} doesn't exist`);

  const isValidPassword = await user.verifyPassword(password);
  if (!isValidPassword) throw new AuthenticationError(`Wrong password`);

  res.locals.user = user;

  res
    .status(201)
    .json({ id: user.id, username: user.username, role: user.role });
};
