import { Router } from 'express';
import userRoutes from './user.routes';
import merchantRoutes from './merchant.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';
import { authenticate } from '../middleware/auth.middleware';
import { auditLogging } from '../middleware/audit.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();

// Public routes
router.use('/auth', userRoutes); // Login/Register usually in user routes

// Protected routes
router.use(authenticate);
router.use(auditLogging);
router.use(rateLimit);

router.use('/users', userRoutes);
router.use('/merchants', merchantRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

export default router;
