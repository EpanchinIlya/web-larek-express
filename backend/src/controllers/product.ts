import { Request, Response, NextFunction } from 'express';
import {
  celebrate, Joi, Segments,
} from 'celebrate';
import ConflictError from '../errors/conflict-error';
import DefaultError from '../errors/default-error';
import Product from '../models/product';

// export interface IProduct{
//   title: string;
//   image: {
//     fileName: string;
//     originalName: string;
//   };
//   category: string;
//   description?: string;
//   price?: number | null;
// }

const productSchema = Joi.object({
  title: Joi.string().required().min(2).max(30),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().allow(null).optional(),
});

export const productRouteValidator = celebrate({
  [Segments.BODY]: productSchema,
});

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
    return res.status(200).send({ data: product });
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
