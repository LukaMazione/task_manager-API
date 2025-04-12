import { ValidationError } from '../src/middlewares/errorHandler';
import {UserModel} from '../src/models/UserModel'
import { logger } from '../src/utils/logger';
export const seedAdmin = async() => {
  const username = 'admin';
  const password = process.env['SEED-ADMIN_PSWD'];

  if(!password) throw new ValidationError('Missing SEED-ADMIN_PSWD environment variable')
  const role = 'admin'
  const existingUser = await UserModel.findByUsername(username);
  
  if (existingUser) {
    logger.error('User already exists')
    throw new ValidationError(`User ${username} already exists`)
  }

    const user = await UserModel.create(username, password, role);
    logger.info(`Created admin "${user.username}" with ID ${user.id}`)

}
