import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

// These endpoints are now just sync points after Firebase Auth
// We use verifyToken to ensure they are actually authenticated with Firebase
router.post('/register', verifyToken, register);
router.post('/login', verifyToken, login);
router.get('/me', verifyToken, me);

export default router;
