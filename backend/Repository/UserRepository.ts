import { PrismaClient } from '@prisma/client';
import { IUserRepository } from './IUserRepository';
import { User } from '../Entity/UserEntity';

export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findByEmail(email: string): Promise<User | null> {
        const row = await this.prisma.user.findUnique({ where: { email } });
        if (!row) return null;
        return { ...row, createdAt: row.createdAt.toISOString() };
    }

    async create(email: string, hashedPassword: string): Promise<User> {
        const row = await this.prisma.user.create({
            data: { email, password: hashedPassword },
        });
        return { ...row, createdAt: row.createdAt.toISOString() };
    }
}