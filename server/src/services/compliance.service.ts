import connection from '../utils/redis';
import logger from '../utils/logger';
import { ApiError } from '../middleware/error.middleware';

class ComplianceService {
    private readonly VELOCITY_LIMIT_24H = 10000000000n; // Example: 10,000 unit limit

    async checkSanctions(userId: string): Promise<boolean> {
        // In production, this would call an OFAC/AML screening API (e.g., Elliptic, Chainalysis)
        logger.info(`Checking sanctions for user: ${userId}`);
        const sanctionedUsers = ['blocked_user_1', 'scammer_99'];
        return sanctionedUsers.includes(userId);
    }

    async checkVelocity(userId: string, amount: bigint): Promise<void> {
        const key = `velocity:24h:${userId}`;

        try {
            const currentTotal = await connection.get(key);
            const newTotal = (currentTotal ? BigInt(currentTotal) : 0n) + amount;

            if (newTotal > this.VELOCITY_LIMIT_24H) {
                logger.warn(`Velocity limit exceeded for user: ${userId}`, { amount, newTotal, limit: this.VELOCITY_LIMIT_24H });
                throw new ApiError(403, 'Daily transaction limit exceeded', 'VELOCITY_LIMIT_EXCEEDED');
            }

            await connection.set(key, newTotal.toString(), 'EX', 86400); // 24h TTL
        } catch (err: any) {
            if (err instanceof ApiError) throw err;
            logger.error('Compliance velocity check failed:', { error: err.message });
            // Fail open for compliance velocity in case of Redis error to avoid blocking UX
        }
    }
}

export default new ComplianceService();
