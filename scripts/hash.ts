import bcrypt from 'bcrypt';
import { logger } from '../src/utils/logger';
const hashPassword = async (password: string): Promise<void> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  logger.info(`Original password: ${password}`);
  logger.info(`Hashed password ${hash}`);
};
hashPassword('admin123');
