import { Request, Response, NextFunction } from 'express';
import metricsService from '../services/metrics.service';
import { ApiError } from '../middleware/error.middleware';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await metricsService.getDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const health = await metricsService.getSystemHealth();
        res.status(200).json(health);
    } catch (error) {
        next(error);
    }
};
