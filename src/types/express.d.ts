import { UserRow } from '../models/UserModel';

declare global {
  namespace Express {
    interface Locals {
      user?: UserRow;
    }
  }
}
