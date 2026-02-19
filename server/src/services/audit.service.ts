import prisma from '../utils/prisma';

interface AuditLogParams {
    actorId: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}

class AuditService {
    async log(params: AuditLogParams) {
        // Port logic from audit_service.rs
        return prisma.auditLog.create({
            data: {
                actorId: params.actorId,
                action: params.action,
                resource: params.resource,
                resourceId: params.resourceId,
                metadata: params.metadata,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
            },
        });
    }

    async getLogs(actorId?: string, limit: number = 50) {
        return prisma.auditLog.findMany({
            where: actorId ? { actorId } : {},
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
}

export default new AuditService();
