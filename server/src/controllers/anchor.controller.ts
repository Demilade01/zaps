import { Request, Response, NextFunction } from 'express';
import anchorService from '../services/anchor.service';
import { ApiError } from '../middleware/error.middleware';

export const createWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { destinationAddress, amount, asset } = req.body;
        const userId = (req as any).user.userId;

        if (!destinationAddress || !amount || !asset) {
            throw new ApiError(400, 'destinationAddress, amount, and asset are required');
        }

        const withdrawal = await anchorService.createWithdrawal(userId, destinationAddress, amount, asset);
        res.status(201).json(withdrawal);
    } catch (error) {
        next(error);
    }
};

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const status = await anchorService.getWithdrawalStatus(id);

        if (!status) {
            throw new ApiError(404, 'Withdrawal not found');
        }

        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
};
