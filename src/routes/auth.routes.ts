import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { verifyToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../utils/validators';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', verifyToken, me);

export default router;
