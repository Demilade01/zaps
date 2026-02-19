import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Only Admins should access these
router.get('/dashboard', adminController.getDashboardStats);
router.get('/health', adminController.getSystemHealth);

export default router;
