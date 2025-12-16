import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import adminRoutes from './admin.routes';
import orderRoutes from './order.routes';
import newsletterRoutes from './newsletter.routes';
import wishlistRoutes from './wishlist.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
