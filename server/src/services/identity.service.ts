import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

class IdentityService {
    async createUser(userId: string, stellarAddress: string, pin: string, role: Role = Role.USER) {
        const pinHash = await bcrypt.hash(pin, 10);

        return prisma.user.create({
            data: {
                userId,
                stellarAddress,
                pinHash,
                role,
                profile: {
                    create: {
                        displayName: userId, // Default display name
                    },
                },
            },
        });
    }

    async getUser(userId: string) {
        return prisma.user.findUnique({
            where: { userId },
            include: { profile: true },
        });
    }

    async resolveUserId(userId: string) {
        const user = await prisma.user.findUnique({
            where: { userId },
            select: { stellarAddress: true },
        });
        return user?.stellarAddress;
    }
}

export default new IdentityService();
