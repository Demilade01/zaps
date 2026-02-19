import { Request, Response, NextFunction } from 'express';
import bridgeService from '../services/bridge.service';
import { ApiError } from '../middleware/error.middleware';

export const initiateTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fromChain, toChain, asset, amount, destinationAddress } = req.body;
        const userId = (req as any).user.userId;

        if (!fromChain || !toChain || !asset || !amount || !destinationAddress) {
            throw new ApiError(400, 'Missing required bridge transfer fields');
        }

        const bridgeTx = await bridgeService.initiateBridgeTransfer({
            fromChain,
            toChain,
            asset,
            amount,
            destinationAddress,
            userId
        });

        res.status(201).json(bridgeTx);
    } catch (error) {
        next(error);
    }
};

export const confirmTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { txHash } = req.body;

        if (!txHash) {
            throw new ApiError(400, 'txHash is required for confirmation');
        }

        const bridgeTx = await bridgeService.confirmBridgeTransaction(id, txHash);
        res.status(200).json(bridgeTx);
    } catch (error) {
        next(error);
    }
};
