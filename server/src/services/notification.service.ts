import prisma from '../utils/prisma';
import { NotificationType } from '@prisma/client';
import queueService, { JobType } from './queue.service';

class NotificationService {
    async createNotification(userId: string, title: string, message: string, type: NotificationType = NotificationType.SYSTEM) {
        // Create in-app notification
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });

        // Enqueue push/email notification job
        await queueService.addJob({
            type: JobType.NOTIFICATION,
            data: {
                userId,
                title,
                message,
            },
        });

        return notification;
    }

    async getNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}

export default new NotificationService();
