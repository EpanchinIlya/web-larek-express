import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import { requestLogger, errorLogger } from './middlewares/logger';

import orderRouter from './routes/order';
import productRouter from './routes/product';
import errorHandler from './errors/all-errors';

const { PORT } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Open your browser and visit http://localhost:${PORT}`);
});
