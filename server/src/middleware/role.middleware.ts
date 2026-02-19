import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const requireRole = (roles: Role[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ error: 'Access denied: insufficient permissions' });
        }

        next();
    };
};

export const adminOnly = requireRole([Role.ADMIN]);
export const merchantOnly = requireRole([Role.MERCHANT, Role.ADMIN]);
export const userOnly = requireRole([Role.USER, Role.ADMIN]);
