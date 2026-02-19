import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { adminOnly } from '../middleware/role.middleware';

const router = Router();

router.use(adminOnly);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/system/health', adminController.getSystemHealth);

export default router;
