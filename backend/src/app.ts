import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/product';

const { PORT } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

const app = express();
app.use(cors());
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', (req: Request, res: Response) => {
  res.send('I am OK');
});

app.use('/product', productRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Open your browser and visit http://localhost:${PORT}`);
});
