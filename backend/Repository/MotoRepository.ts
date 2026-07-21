import { PrismaClient, Moto as PrismaMoto } from '@prisma/client';
import { IMotoRepository } from './IMotoRepository';
import { Moto, MotoType } from '../Entity/MotoEntity';


export class MotoRepository implements IMotoRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(): Promise<Moto[]> {
        const rows = await this.prisma.moto.findMany();
        return rows.map(this.toDomain);
    }

    async findById(id: string): Promise<Moto | null> {
        const row = await this.prisma.moto.findUnique({ where: { id } });
        return row ? this.toDomain(row) : null;
    }

    private toDomain(row: PrismaMoto): Moto {
        return {
            id: row.id,
            marque: row.marque,
            modele: row.modele,
            annee: row.annee,
            kilometrage: row.kilometrage,
            prix: row.prix,
            cylindree: row.cylindree,
            puissance: row.puissance,
            type: row.type as MotoType,
            localisation: row.localisation,
            region: row.region,
            vendeur: row.vendeur,
            datePublication: row.datePublication.toISOString(),
            photoUrl: row.photoUrl,
            distanceKm: row.distanceKm,
        };
    }
}