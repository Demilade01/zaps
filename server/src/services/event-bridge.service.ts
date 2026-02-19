import sorobanService from './soroban.service';
import prisma from '../utils/prisma';
import { PaymentStatus } from '@prisma/client';

class EventBridgeService {
    private isRunning: boolean = false;
    private lastLedger: number = 0;

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('Event Bridge started...');

        // Initialize lastLedger to latest if 0
        if (this.lastLedger === 0) {
            try {
                this.lastLedger = await sorobanService.getLatestLedger();
                console.log(`Event Bridge initialized at ledger ${this.lastLedger}`);
            } catch (err) {
                console.error('Failed to initialize Event Bridge ledger:', err);
                this.lastLedger = 1; // Fallback
            }
        }

        this.poll();
    }

    private async poll() {
        while (this.isRunning) {
            try {
                // Port logic from indexer_service.rs
                // Get events since lastLedger
                const events = await sorobanService.getEvents(this.lastLedger);

                for (const event of events.events) {
                    await this.processEvent(event);
                }

                // Update lastLedger (this should be persisted to DB in real implementation)
                // this.lastLedger = ...;

                await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            } catch (err) {
                console.error('Event Bridge polling error:', err);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }

    private async processEvent(event: any) {
        // Port logic from indexer_service.rs
        // Example: Handle PAY_DONE event
        if (event.type === 'contract' && event.name === 'PAY_DONE') {
            const paymentId = event.data.paymentId;
            await prisma.payment.update({
                where: { id: paymentId },
                data: { status: PaymentStatus.COMPLETED },
            });
            console.log(`Payment ${paymentId} completed on-chain`);
        }
    }

    stop() {
        this.isRunning = false;
    }
}

export default new EventBridgeService();
