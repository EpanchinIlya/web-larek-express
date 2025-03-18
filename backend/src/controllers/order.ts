import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import {
  celebrate, Joi, Segments,
} from 'celebrate';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+7\d{10}$/;

const orderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  address: Joi.string().required(),
  total: Joi.number().min(0).required(),
  items: Joi.array().items(
    Joi.string().required(),
  ).min(1).required(),
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchema,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log('Post запрос +++');
    const { total } = req.body;
    const uuid = faker.string.uuid();

    res.send({ id: uuid, total });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
