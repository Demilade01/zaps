import { Request, Response } from 'express';
import auditService from '../services/audit.service';
import prisma from '../utils/prisma';

class AdminController {
    async getDashboardStats(req: Request, res: Response) {
        // Port logic from admin.rs
        const userCount = await prisma.user.count();
        const merchantCount = await prisma.merchant.count();
        const paymentVolume = await prisma.payment.aggregate({
            _sum: { sendAmount: true },
        });

        res.json({
            users: userCount,
            merchants: merchantCount,
            totalVolume: paymentVolume._sum.sendAmount?.toString() || '0',
        });
    }

    async getAuditLogs(req: Request, res: Response) {
        const logs = await auditService.getLogs();
        res.json(logs);
    }

    async getSystemHealth(req: Request, res: Response) {
        res.json({
            status: 'UP',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        });
    }
}

export default new AdminController();
