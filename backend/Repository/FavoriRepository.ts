import { PrismaClient } from '@prisma/client';
import { IFavoriRepository } from './IFavoriRepository';
import { FavoriWithMoto } from '../Entity/FavoriEntity';
import { MotoType } from '../Entity/MotoEntity';

export class FavoriRepository implements IFavoriRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findAllByUser(userId: string): Promise<FavoriWithMoto[]> {
        const rows = await this.prisma.favori.findMany({
            where: { userId },
            include: { moto: true },
            orderBy: { createdAt: 'desc' },
        });

        return rows.map((row) => ({
            id: row.id,
            userId: row.userId,
            motoId: row.motoId,
            createdAt: row.createdAt.toISOString(),
            moto: {
                ...row.moto,
                type: row.moto.type as MotoType,
                datePublication: row.moto.datePublication.toISOString(),
                createdAt: row.moto.createdAt.toISOString(),
            },
        }));
    }

    async exists(userId: string, motoId: string): Promise<boolean> {
        const row = await this.prisma.favori.findUnique({
            where: { userId_motoId: { userId, motoId } },
        });
        return row !== null;
    }

    async create(userId: string, motoId: string): Promise<void> {
        await this.prisma.favori.create({ data: { userId, motoId } });
    }

    async delete(userId: string, motoId: string): Promise<void> {
        await this.prisma.favori.delete({
            where: { userId_motoId: { userId, motoId } },
        });
    }
}