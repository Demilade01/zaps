import { Worker, Job } from 'bullmq';
import { connection } from '../utils/redis';
import { JobType } from '../services/queue.service';

export const startWorkers = () => {
    const worker = new Worker('default', async (job: Job) => {
        console.log(`Processing job ${job.id} of type ${job.name}`);

        switch (job.name) {
            case JobType.EMAIL:
                await processEmail(job.data);
                break;
            case JobType.NOTIFICATION:
                await processNotification(job.data);
                break;
            case JobType.BLOCKCHAIN_TX:
                await processBlockchainTx(job.data);
                break;
            case JobType.SYNC:
                await processSync(job.data);
                break;
            default:
                console.warn(`Unknown job type: ${job.name}`);
        }
    }, { connection: connection as any });

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        console.error(`Job ${job?.id} failed with error: ${err.message}`);
    });

    console.log('Background workers started...');
};

const processEmail = async (data: any) => {
    // Port logic from EmailProcessor in Rust
    console.log('Sending email to:', data.to);
};

const processNotification = async (data: any) => {
    // Port logic from NotificationProcessor in Rust
    console.log('Sending notification to user:', data.userId);
};

const processBlockchainTx = async (data: any) => {
    // Port logic from BlockchainTxProcessor in Rust
    console.log('Processing blockchain transaction...');
};

const processSync = async (data: any) => {
    // Port logic from SyncProcessor in Rust
    console.log('Performing sync operation:', data.syncType);
};
