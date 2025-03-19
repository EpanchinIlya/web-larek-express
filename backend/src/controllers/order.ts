import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import DefaultError from '../errors/default-error';
import Product, { IProduct } from '../models/product';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});

    const {
      _payment, _email, _phone, total, _address, items,
    } = req.body;

    // проверка, что  массив товаров не пустой
    if (items.length === 0) {
      return next(new BadRequestError('Нет товаров в заказе'));
    }

    // проверка, что все товары есть
    const productId = new Set(products.map((p) => p._id.toString()));
    const missingItems = items.filter((item:Types.ObjectId) => !productId.has(item.toString())).join(', ');
    if (missingItems !== '') {
      return next(new BadRequestError(`Товары с id: ${missingItems} не найдены`));
    }

    const fullItems = products.filter((product) => items.includes(product.id));
    // проверка, что все товары продаются

    const unavailableItems = fullItems.filter((item: IProduct) => item.price === null);
    if (unavailableItems.length > 0) {
      const unavailableItemIds = unavailableItems.map((item) => item._id).join(', ');
      return next(new BadRequestError(`Товары с id: ${unavailableItemIds} не продаются`));
    }

    // проверка, сумма заказа совпадает с суммой цен товаров
    const totalPrice = fullItems.reduce((sum: number, item) => sum + (item.price ?? 0), 0);
    if (totalPrice !== total) return next(new BadRequestError('Неверная сумма заказа'));

    const uuid = faker.string.uuid();

    return res.send({ id: uuid, total });
  } catch (error) {
    if (error instanceof Error) {
      return next(new DefaultError(error.message));
    }
    return next(new DefaultError('Неизвестная ошибка'));
  }
};
