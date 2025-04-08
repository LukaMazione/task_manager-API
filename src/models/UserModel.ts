import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { db } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { DatabaseError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'employee';
  created_at: string;
}

export interface UserCreate {
  username: string;
  password: string;
  role: 'admin' | 'employee';
}

export class UserModel {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'employee';
  created_at: string;

  constructor(data: UserRow) {
    this.id = data.id;
    this.username = data.username;
    this.password_hash = data.password_hash;
    this.role = data.role;
    this.created_at = data.created_at;
  }

  static async create(
    username: string,
    password: string,
    role: 'admin' | 'employee',
  ): Promise<UserModel> {
    try {
      const id = uuid();
      const saltRound = 10;
      const password_hash = await bcrypt.hash(password, saltRound);

      await db.execute<ResultSetHeader>(
        `INSERT INTO users (id, username, password_hash, role) VALUES (:id, :username, :password_hash, :role)`,
        { id, username, password_hash, role },
      );

      const [rows] = await db.execute<(RowDataPacket & UserRow)[]>(
        'SELECT * FROM users WHERE id = :id',
        { id },
      );

      if (rows.length === 0) throw new DatabaseError('Fail to create user');
      return new UserModel(rows[0]);
    } catch (error) {
      logger.error('Error in UserModel.create:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error (UserModel.create)');
  }

  static async findByUsername(username: string): Promise<UserModel | null> {
    try {
      const [row] = await db.execute<(RowDataPacket & UserRow)[]>(
        'SELECT * FROM users WHERE username = :username',
        { username },
      );
      return row.length === 0 ? null : new UserModel(row[0]);
    } catch (error) {
      logger.error('Error in UserModel.findByUsername', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
    }
    throw new DatabaseError(
      'Unexpected database error (UserModel.findByUsername)',
    );
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}
