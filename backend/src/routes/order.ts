import { Router } from 'express';
import { orderRouteValidator } from '../middlewares/validators';

import createOrder from '../controllers/order';

const router = Router();

router.post('/', orderRouteValidator, createOrder);

export default router;
