import { Router } from 'express';
import { 
  createOrder, 
  verifyPayment, 
  getMyOrders, 
  getOrderById,
  createGuestOrder,
  lookupGuestOrder,
} from '../controllers/order.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema, createGuestOrderSchema } from '../utils/validators';

const router = Router();

// Webhook endpoint (no auth - verified by signature)
router.post('/verify', verifyPayment);

// Guest checkout endpoints (no auth required)
router.post('/guest', validate(createGuestOrderSchema), createGuestOrder);
router.get('/lookup', lookupGuestOrder);

// Protected routes
router.use(verifyToken);
router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

export default router;
