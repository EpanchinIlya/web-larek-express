import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import DefaultError from '../errors/default-error';
import Product, { IProduct } from '../models/product';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      _payment, _email, _phone, total, _address, items,
    } = req.body;

    // проверка, что  массив товаров не пустой
    if (items.length === 0) {
      return next(new BadRequestError('Нет товаров в заказе'));
    }

    const invalidItems = items.filter((id:string) => id.length !== 24);

    if (invalidItems.length !== 0) {
      return next(new BadRequestError(`id товаров: ${invalidItems.join(', ')} некорректны`));
    }

    // запрос полных продуктов по id
    const foundProducts = await Product.find({ _id: { $in: items } });
    console.log(foundProducts);

    const foundIds = foundProducts.map((product) => product._id.toString());

    // проверка, что все  продукты есть в магазине
    if (foundProducts.length !== items.length) {
      const missingIds = items.filter((id:string) => !foundIds.includes(id)).join(', ');
      return next(new BadRequestError(`Товары с id: ${missingIds} не найдены`));
    }

    // проверка, что все товары продаются
    const unavailableItems = foundProducts.filter((item: IProduct) => item.price === null);
    if (unavailableItems.length > 0) {
      const unavailableItemIds = unavailableItems.map((item) => item._id).join(', ');
      return next(new BadRequestError(`Товары с id: ${unavailableItemIds} не продаются`));
    }

    // проверка, сумма заказа совпадает с суммой цен товаров
    const totalPrice = foundProducts.reduce((sum: number, item) => sum + (item.price ?? 0), 0);
    if (totalPrice !== total) return next(new BadRequestError('Неверная сумма заказа'));

    const uuid = faker.string.uuid();
    return res.status(200).send({ id: uuid, total });
  } catch (error) {
    if (error instanceof Error) {
      return next(new DefaultError(error.message));
    }
    return next(new DefaultError('Неизвестная ошибка'));
  }
};
