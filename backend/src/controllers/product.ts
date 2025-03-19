import { Request, Response, NextFunction } from 'express';
import ConflictError from '../errors/conflict-error';
import DefaultError from '../errors/default-error';
import Product from '../models/product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (error) {
    if (error instanceof Error) {
      return next(new DefaultError(error.message));
    }
    return next(new DefaultError('Неизвестная ошибка'));
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    console.log(req.body);
    return res.status(200).send(product);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        return next(new ConflictError(error.message));
      }
      return next(new DefaultError(error.message));
    }

    return next(new DefaultError('Неизвестная ошибка'));
  }
};
