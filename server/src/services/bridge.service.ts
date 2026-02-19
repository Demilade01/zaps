import complianceService from './compliance.service';
import prisma from '../utils/prisma';
import logger from '../utils/logger';
import { ApiError } from '../middleware/error.middleware';
import config from '../config';

export interface BridgeTransferRequest {
    fromChain: string;
    toChain: string;
    asset: string;
    amount: string;
    destinationAddress: string;
    userId: string;
}

class BridgeService {
    private supportedChains = ['ethereum', 'polygon', 'bsc', 'stellar'];
    private supportedAssets = ['USDC', 'USDT', 'ETH', 'XLM']; // Mock from config

    async initiateBridgeTransfer(request: BridgeTransferRequest) {
        this.validateBridgeRequest(request);

        const isSanctioned = await complianceService.checkSanctions(request.userId);
        if (isSanctioned) {
            throw new ApiError(403, 'User is sanctioned and cannot perform this action');
        }

        await complianceService.checkVelocity(request.userId, BigInt(request.amount));

        logger.info(`Initiating bridge transfer: ${request.amount} ${request.asset} from ${request.fromChain} to ${request.toChain}`);

        const bridgeTx = await prisma.bridgeTransaction.create({
            data: {
                fromChain: request.fromChain,
                toChain: request.toChain,
                asset: request.asset,
                amount: BigInt(request.amount),
                destinationAddress: request.destinationAddress,
                userId: request.userId,
                status: 'PENDING'
            }
        });

        return bridgeTx;
    }

    async confirmBridgeTransaction(id: string, txHash: string) {
        logger.info(`Confirming bridge transaction: ${id} with hash ${txHash}`);

        return prisma.bridgeTransaction.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                txHash
            }
        });
    }

    private validateBridgeRequest(request: BridgeTransferRequest) {
        if (!this.supportedChains.includes(request.fromChain)) {
            throw new ApiError(400, `Unsupported source chain: ${request.fromChain}`);
        }

        if (request.toChain !== 'stellar') {
            throw new ApiError(400, 'Only bridging to Stellar is currently supported');
        }

        if (!this.supportedAssets.includes(request.asset)) {
            throw new ApiError(400, `Asset ${request.asset} is not supported for bridging`);
        }

        const amount = BigInt(request.amount);
        if (amount <= 0n) {
            throw new ApiError(400, 'Amount must be greater than zero');
        }
    }
}

export default new BridgeService();
