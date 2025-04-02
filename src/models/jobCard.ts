import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db';
import { v4 as uuid } from 'uuid';
import { DatabaseError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

export interface JobCardCreate {
  job_card_number: string;
  chassis_number?: string;
  image_path: string;
}

// export interface JobCard {
//   id: string;
//   job_card_number: string;
//   chassis_number: string | null;
//   image_path: string;
//   created_at: string;
//   updated_at: string;
// }

export class JobCardModel {
  id!: string;
  job_card_number: string;
  chassis_number?: string | null;
  image_path: string;
  created_at!: string;
  updated_at!: string;

  constructor(data: JobCardCreate | JobCardModel) {
    if (`id` in data) this.id = data.id;
    this.job_card_number = data.job_card_number;
    this.chassis_number = data.chassis_number ?? null;
    this.image_path = data.image_path;
    if (`created_at` in data) this.created_at = data.created_at;
    if (`updated_at` in data)
      this.updated_at = data.updated_at ?? data.created_at;
  }

  static async create(
    job_card_number: string,
    image_path: string,
    chassis_number?: string,
  ): Promise<JobCardModel> {
    try {
      const id = uuid();

      await db.execute<ResultSetHeader>(
        `INSERT INTO job_cards (id, job_card_number, chassis_number, image_path) 
         VALUES (?, ?, ?, ?)`,
        [id, job_card_number, chassis_number ?? null, image_path],
      );

      const [rows] = await db.execute<(RowDataPacket & JobCardModel)[]>(
        'SELECT * FROM `job_cards` WHERE `id` = :id',
        { id },
      );

      if (rows.length === 0) throw new DatabaseError('Fail to create job card');

      return new JobCardModel(rows[0]);
    } catch (error) {
      logger.error('Error in JobCardModel.create:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error');
  }

  static async getAll(): Promise<JobCardModel[]> {
    try {
      const [rows] = await db.execute<(RowDataPacket & JobCardModel)[]>(
        'SELECT * FROM `job_cards`',
      );
      return rows.map((row) => new JobCardModel(row));
    } catch (error) {
      logger.error('Error in JobCardModel.getAll:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error');
  }

  static async findById(id: string): Promise<JobCardModel | null> {
    try {
      const [result] = await db.execute<(RowDataPacket & JobCardModel)[]>(
        'SELECT * FROM `job_cards` WHERE `id` = ?',
        [id],
      );
      return result.length === 0 ? null : new JobCardModel(result[0]);
    } catch (error) {
      logger.error('Error in JobCardModel.findById:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error');
  }

  static async findByJobCardNumber(
    job_card_number: string,
  ): Promise<JobCardModel | null> {
    try {
      const [result] = await db.execute<(ResultSetHeader & JobCardModel)[]>(
        'SELECT * FROM `job_cards` WHERE `job_card_number` = :job_card_number',
        { job_card_number },
      );
      return result.length === 0 ? null : new JobCardModel(result[0]);
    } catch (error) {
      logger.error('Error in JobCardModel.findByJobCardNumber:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error');
  }
}
