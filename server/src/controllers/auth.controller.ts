import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import identityService from '../services/identity.service';
import { ApiError } from '../middleware/error.middleware';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, stellarAddress, pin, role } = req.body;

        if (!userId || !stellarAddress || !pin) {
            throw new ApiError(400, 'userId, stellarAddress, and pin are required');
        }

        logger.info(`Registering new user: ${userId}`);
        const user = await identityService.createUser(userId, stellarAddress, pin, role);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                userId: user.userId,
                stellarAddress: user.stellarAddress,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, pin } = req.body;

        if (!userId || !pin) {
            throw new ApiError(400, 'userId and pin are required');
        }

        const result = await authService.login(userId, pin);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
