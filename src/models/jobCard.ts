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

export interface JobCardRow {
  id: string;
  job_card_number: string;
  chassis_number?: string | null;
  image_path: string;
  created_at: string;
  updated_at: string | null;
}

type UpdatebleJobCardFields = Partial<
  Pick<JobCardRow, 'chassis_number' | 'image_path' | 'job_card_number'>
>;

export class JobCardModel {
  id!: string;
  job_card_number: string;
  chassis_number?: string | null;
  image_path: string;
  created_at!: string;
  updated_at!: string;

  constructor(data: JobCardCreate | JobCardRow) {
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
         VALUES (:id, :job_card_number, :chassis_number, :image_path)`,
        [id, job_card_number, chassis_number ?? null, image_path],
      );

      const [rows] = await db.execute<(RowDataPacket & JobCardRow)[]>(
        'SELECT * FROM job_cards WHERE id = :id',
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
    throw new DatabaseError('Unexpected database error (create)');
  }

  static async getAll(): Promise<JobCardModel[]> {
    try {
      const [rows] = await db.execute<(RowDataPacket & JobCardRow)[]>(
        'SELECT * FROM job_cards',
      );
      return rows.map((row) => new JobCardModel(row));
    } catch (error) {
      logger.error('Error in JobCardModel.getAll:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error (getAll)');
  }

  static async findById(id: string): Promise<JobCardModel | null> {
    try {
      const [result] = await db.execute<(RowDataPacket & JobCardRow)[]>(
        'SELECT * FROM job_cards WHERE `id` = :id',
        { id },
      );
      return result.length === 0 ? null : new JobCardModel(result[0]);
    } catch (error) {
      logger.error('Error in JobCardModel.findById:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error (findById)');
  }

  static async findByJobCardNumber(
    job_card_number: string,
  ): Promise<JobCardModel | null> {
    try {
      const [result] = await db.execute<(RowDataPacket & JobCardRow)[]>(
        'SELECT * FROM job_cards WHERE job_card_number = :job_card_number',
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
    throw new DatabaseError('Unexpected database error (findByJobCardNumber)');
  }

  static async findByChassisNumber(
    chassis_number: string,
  ): Promise<JobCardModel | null> {
    try {
      const [result] = await db.execute<(RowDataPacket & JobCardRow)[]>(
        'SELECT * FROM job_cards WHERE chassis_number = :chassis_number',
        {
          chassis_number,
        },
      );
      return result.length === 0 ? null : new JobCardModel(result[0]);
    } catch (error) {
      logger.error('Error in JobCardModel.findByChassisNumber:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error (findByChassisNumber)');
  }

  async update(fields: UpdatebleJobCardFields): Promise<this> {
    if (!this.id) {
      throw new Error('JobCard not found');
    }

    const updates: string[] = [];
    const values: Record<string, unknown> = { id: this.id };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        const typedKey = key as keyof UpdatebleJobCardFields;
        updates.push(`${typedKey} = :${typedKey}`);
        values[typedKey] = value ?? null;

        if (value === null && typedKey === 'chassis_number') {
          this[typedKey] = null;
        } else {
          this[typedKey] = value as string;
        }
      }
    }
    if (updates.length === 0) return this;
    try {
      await db.execute<ResultSetHeader>(
        `UPDATE job_cards SET ${updates.join(', ')} WHERE id = :id`,
        values,
      );
      return this;
    } catch (error) {
      logger.error('Error in JobCardModel.update:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      throw new DatabaseError('Unexpected database error (update)');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.execute<ResultSetHeader>(`DELETE FROM job_cards WHERE id =:id`, {
        id,
      });
    } catch (error) {
      logger.error('Error in JobCardModel.delete:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DatabaseError) throw error;
    }
    throw new DatabaseError('Unexpected database error (delete)');
  }
}
