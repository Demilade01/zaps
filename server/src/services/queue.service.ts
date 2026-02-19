import { Queue, JobsOptions } from 'bullmq';
import { connection } from '../utils/redis';

export enum JobType {
    EMAIL = 'EMAIL',
    NOTIFICATION = 'NOTIFICATION',
    SYNC = 'SYNC',
    BLOCKCHAIN_TX = 'BLOCKCHAIN_TX',
}

export interface JobPayload {
    type: JobType;
    data: any;
}

class QueueService {
    private queues: Map<string, Queue> = new Map();

    constructor() {
        this.createQueue('default');
    }

    private createQueue(name: string) {
        const queue = new Queue(name, { connection: connection as any });
        this.queues.set(name, queue);
        return queue;
    }

    public getQueue(name: string = 'default'): Queue {
        return this.queues.get(name) || this.createQueue(name);
    }

    public async addJob(payload: JobPayload, options?: JobsOptions) {
        const queue = this.getQueue();
        return queue.add(payload.type, payload.data, options);
    }
}

export default new QueueService();
