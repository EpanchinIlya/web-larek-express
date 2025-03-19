import {
  celebrate, Joi, Segments,
} from 'celebrate';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const orderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().min(0).required(),
  items: Joi.array().items(
    Joi.string().required(),
  ).min(1).required(),
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchema,
});

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
