import { Router } from 'express';

import { createOrder, orderRouteValidator } from '../controllers/order';

const router = Router();

router.post('/', orderRouteValidator, createOrder);

export default router;
