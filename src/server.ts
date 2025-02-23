import express from 'express';
import cors from 'cors';
import { config } from './config';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    "Beacon": "5 h, zakończono",
    "Side markers": "3h , wtoku"
  });
});

app.listen(Number(config.port), '0.0.0.0', () => {
  console.log(`Server is running on port ${config.port}`);
});
