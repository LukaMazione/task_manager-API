import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db';
import { v4 as uuid } from 'uuid';
import { DatabaseError } from '../middlewares/errorHandler';

export interface JobCardCreate {
  job_card_number: string;
  chassis_number?: string;
  image_path: string;
}

export interface JobCard {
  id: string;
  job_card_number: string;
  chassis_number: string | null;
  image_path: string;
  created_at: string;
  updated_at: string;
}

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
  ): Promise<JobCard> {
    try {
      const id = uuid();

      await db.execute<ResultSetHeader>(
        `INSERT INTO job_cards (id, job_card_number, chassis_number, image_path) 
         VALUES (?, ?, ?, ?)`,
        [id, job_card_number, chassis_number ?? null, image_path],
      );

      const [rows] = await db.execute<(RowDataPacket & JobCard)[]>(
        'SELECT * FROM `job_cards` WHERE `id` = :id',
        { id },
      );

      if (rows.length === 0) throw new DatabaseError('Fail to create job card');

      return rows[0];
    } catch (error) {
      console.error('Error in JobCardModel.create:', error);
      throw new DatabaseError(`Error creating job card:`);
    }
  }
}
