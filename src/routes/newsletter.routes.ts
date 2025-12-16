import { Router } from 'express';
import { subscribe, unsubscribe, getSubscribers } from '../controllers/newsletter.controller';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

// Email validation schema
const emailSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
  }),
});

// Public routes
router.post('/subscribe', validate(emailSchema), subscribe);
router.post('/unsubscribe', validate(emailSchema), unsubscribe);

// Admin routes
router.get('/subscribers', verifyToken, requireAdmin, getSubscribers);

export default router;
