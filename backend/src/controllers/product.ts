import { Request, Response } from 'express';
import Product from '../models/product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProducts = async (req: Request, res: Response) => {
  try {
    console.log('Get запрос');
    const products = await Product.find({});
    res.send({ data: products });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log('Post запрос');
    const {
      title, image, category, description, price,
    } = req.body;

    const product = await Product.create({
      title, image, category, description, price,
    });
    res.send({ data: product });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
