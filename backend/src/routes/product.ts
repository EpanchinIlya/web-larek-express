import { Router } from 'express';

import { getProducts, createProduct } from '../controllers/product';
import { productRouteValidator } from '../middlewares/validators';

const route = Router();

route.get('/', getProducts);

route.post('/', productRouteValidator, createProduct);

export default route;
