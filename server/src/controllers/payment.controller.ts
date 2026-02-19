import { Request, Response, NextFunction } from 'express';
import paymentService from '../services/payment.service';
import { ApiError } from '../middleware/error.middleware';

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { merchantId, fromAddress, amount, assetCode, assetIssuer } = req.body;

        if (!merchantId || !fromAddress || !amount || !assetCode) {
            throw new ApiError(400, 'Missing required fields for payment');
        }

        const result = await paymentService.createPayment(merchantId, fromAddress, amount, assetCode, assetIssuer);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const transfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { toUserId, amount, assetCode, assetIssuer } = req.body;
        const fromUserId = (req as any).user.userId;

        if (!toUserId || !amount || !assetCode) {
            throw new ApiError(400, 'Missing required fields for transfer');
        }

        const result = await paymentService.transfer(fromUserId, toUserId, amount, assetCode, assetIssuer);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const getPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const status = await paymentService.getPaymentStatus(id);

        if (!status) {
            throw new ApiError(404, 'Payment not found');
        }

        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
};
