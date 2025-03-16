import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { config } from './config';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { adminRouter } from './routes/admin.router';

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 5 * 1000 * 60,
    limit: 100,
  }),
);

app.use('/admin', adminRouter);

app.use(errorHandler);

app.listen(Number(config.port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${config.port}`);
});
