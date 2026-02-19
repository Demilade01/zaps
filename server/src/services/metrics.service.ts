import prisma from '../utils/prisma';
import logger from '../utils/logger';

class MetricsService {
    private startTime: number = Date.now();
    private requestCount: number = 0;
    private errorCount: number = 0;

    recordRequest(status: number) {
        this.requestCount++;
        if (status >= 400) {
            this.errorCount++;
        }
    }

    getUptime(): number {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    getErrorRate(): number {
        if (this.requestCount === 0) return 0;
        return (this.errorCount / this.requestCount) * 100;
    }

    async getDashboardStats() {
        const [
            totalUsers,
            totalPayments,
            totalTransfers,
            totalWithdrawals,
            activeMerchants
        ] = await Promise.all([
            prisma.user.count(),
            prisma.payment.count(),
            prisma.transfer.count(),
            prisma.withdrawal.count(),
            prisma.merchant.count(),
        ]);

        return {
            totalUsers,
            totalPayments,
            totalTransfers,
            totalWithdrawals,
            activeMerchants,
            uptime: this.getUptime(),
            errorRate: this.getErrorRate(),
            requestCount: this.requestCount
        };
    }

    async getSystemHealth() {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return {
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString()
            };
        } catch (err) {
            return {
                status: 'degraded',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            };
        }
    }
}

export default new MetricsService();
