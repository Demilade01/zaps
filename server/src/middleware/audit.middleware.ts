import { Request, Response, NextFunction } from 'express';
import auditService from '../services/audit.service';

export const auditLogging = (req: any, res: Response, next: NextFunction) => {
    // Only log state-changing requests
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        const originalSend = res.send;

        res.send = function (body) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Log asynchronously after response is sent
                auditService.log({
                    actorId: req.user?.userId || 'anonymous',
                    action: req.method,
                    resource: req.path,
                    metadata: {
                        body: req.body,
                        status: res.statusCode,
                    },
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent'),
                }).catch(err => console.error('Audit logging failed:', err));
            }
            return originalSend.apply(res, arguments as any);
        };
    }
    next();
};
