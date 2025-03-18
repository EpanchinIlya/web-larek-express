import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import productRouter from './routes/product';
import orderRouter from './routes/order';

const { PORT } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Open your browser and visit http://localhost:${PORT}`);
});
