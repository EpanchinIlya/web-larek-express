import { Request, Response } from 'express';
import {
  celebrate, Joi, Segments,
} from 'celebrate';
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
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.send({ items: products, total: products.length });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    // const {
    //   title, image, category, description, price,
    // } = req.body;

    const product = await Product.create(req.body);

    return res.status(200).send({ data: product });
  } catch (error) {
    if (error instanceof Error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const mongoError = error as { code: number; message: string };

        if (mongoError.code === 11000) {
          console.log('Ошибка: дубликат ключа', mongoError.message);
          return res.status(409).send({ message: mongoError.message });
        }
      }

      return res.status(400).send({ message: error.message });
    }
    return res.status(500).send({ message: 'Произошла неизвестная ошибка' });
  }
};
