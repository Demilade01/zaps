import { Request, Response, NextFunction } from 'express';
import connection from '../utils/redis';

// Simplified rate limiting using Redis
export const rateLimit = async (req: any, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    try {
        const current = await connection.incr(key);
        if (current === 1) {
            await connection.expire(key, 60); // 1 minute window
        }

        if (current > 100) { // Limit to 100 req per minute
            return res.status(429).json({ error: 'Too many requests' });
        }

        next();
    } catch (err) {
        console.error('Rate limiting failed:', err);
        next(); // Fail open for rate limiting
    }
};
