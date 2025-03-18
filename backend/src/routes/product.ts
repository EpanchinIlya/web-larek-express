import { Router } from 'express';

import { getProducts, createProduct, productRouteValidator } from '../controllers/product';

const route = Router();

route.get('/', getProducts);

route.post('/', productRouteValidator, createProduct);

export default route;
