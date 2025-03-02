import express from 'express'
import cors from 'cors'
import { config } from './config'
import rateLimit from 'express-rate-limit';

const app = express()

app.use(cors());
app.use(express.json())

app.use(rateLimit({
  windowMs: 5 * 1000 * 60,
  limit: 100
}))

// eslint-disable-next-line no-console
app.listen(Number(config.port), '0.0.0.0', () => {
  console.log(`Server is running on port ${config.port}`);
});
