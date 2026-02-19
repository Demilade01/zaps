import { TransactionBuilder, Account, Asset, Operation, Networks } from '@stellar/stellar-sdk';
import prisma from '../utils/prisma';
import config from '../config';
import { ApiError } from '../middleware/error.middleware';
import logger from '../utils/logger';

import complianceService from './compliance.service';

class PaymentService {
    private networkPassphrase = config.stellar.networkPassphrase;

    async createPayment(merchantId: string, fromAddress: string, amount: string, assetCode: string, assetIssuer?: string) {
        // Sanctions and Velocity check
        // In real app, we need userId from the authenticated request
        // For skeletal simplicity in this specific method, assume userId is provided or handle via middleware later
        // But let's add it for parity

        const merchant = await prisma.merchant.findUnique({
            where: { merchantId },
        });

        if (!merchant) {
            throw new ApiError(404, 'Merchant not found');
        }

        const asset = assetCode === 'XLM'
            ? Asset.native()
            : new Asset(assetCode, assetIssuer!);

        // Create a new payment record in DB
        const payment = await prisma.payment.create({
            data: {
                merchantId,
                fromAddress,
                sendAsset: assetCode === 'XLM' ? 'native' : `${assetCode}:${assetIssuer}`,
                sendAmount: BigInt(amount), // Assuming amount is in stroops or smallest unit
                status: 'PENDING',
            },
        });

        // Build a skeletal transaction for the client to sign
        // In real Zaps, this would likely be a Soroban contract call or a complex Stellar TX
        // For now, we build a simple Payment operation
        const tx = new TransactionBuilder(new Account(fromAddress, '0'), {
            fee: '100',
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(Operation.payment({
                destination: merchant.vaultAddress,
                asset,
                amount,
            }))
            .setTimeout(0)
            .build();

        return {
            paymentId: payment.id,
            xdr: tx.toXDR(),
            status: payment.status,
        };
    }

    async transfer(fromUserId: string, toUserId: string, amount: string, assetCode: string, assetIssuer?: string) {
        const fromUser = await prisma.user.findUnique({ where: { userId: fromUserId } });
        const toUser = await prisma.user.findUnique({ where: { userId: toUserId } });

        if (!fromUser || !toUser) {
            throw new ApiError(404, 'One or both users not found');
        }

        const asset = assetCode === 'XLM'
            ? Asset.native()
            : new Asset(assetCode, assetIssuer!);

        const transfer = await prisma.transfer.create({
            data: {
                fromUserId,
                toUserId,
                amount: BigInt(amount),
                asset: assetCode === 'XLM' ? 'native' : `${assetCode}:${assetIssuer}`,
                status: 'PENDING',
            },
        });

        const tx = new TransactionBuilder(new Account(fromUser.stellarAddress, '0'), {
            fee: '100',
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(Operation.payment({
                destination: toUser.stellarAddress,
                asset,
                amount,
            }))
            .setTimeout(0)
            .build();

        return {
            transferId: transfer.id,
            xdr: tx.toXDR(),
            status: transfer.status,
        };
    }

    async getPaymentStatus(paymentId: string) {
        return prisma.payment.findUnique({
            where: { id: paymentId },
        });
    }
}

export default new PaymentService();
