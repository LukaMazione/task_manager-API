import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { config } from './utils/config';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { adminRouter } from './routes/admin.router';
import path from 'path';
import { logger } from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use(
  rateLimit({
    windowMs: 5 * 1000 * 60,
    limit: 100,
  }),
);

app.use('/admin', adminRouter);

app.use(errorHandler);

app.listen(Number(config.port), '0.0.0.0', () => {
  logger.info(`Server is running on port ${config.port}`);
});
