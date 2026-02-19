import { Worker, Job } from 'bullmq';
import { connection } from '../utils/redis';
import { JobType } from '../services/queue.service';
import logger from '../utils/logger';

export const startWorkers = () => {
    const worker = new Worker('default', async (job: Job) => {
        logger.info(`Processing job ${job.id} of type ${job.name}`);

        try {
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
                    logger.warn(`Unknown job type: ${job.name}`);
            }
        } catch (err: any) {
            logger.error(`Error processing job ${job.id}: ${err.message}`, { stack: err.stack });
            throw err; // Allow BullMQ to handle retries
        }
    }, {
        connection: connection as any,
        concurrency: 5
    });

    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });

    logger.info('Background workers started...');
};

const processEmail = async (data: any) => {
    // Integration with SendGrid/AWS SES would go here
    logger.info('Sending email to:', { to: data.to, subject: data.subject });
};

const processNotification = async (data: any) => {
    // Integration with FCM/OneSignal would go here
    logger.info('Sending push notification to user:', { userId: data.userId, title: data.title });
};

const processBlockchainTx = async (data: any) => {
    // Logic to submit XDR to Stellar network and monitor status
    logger.info('Submitting blockchain transaction...');
};

const processSync = async (data: any) => {
    // Logic for analytical syncs or database maintenance
    logger.info('Performing sync operation:', { syncType: data.syncType });
};
