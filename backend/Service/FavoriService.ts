import { IFavoriRepository } from '../Repository/IFavoriRepository';
import { FavoriWithMoto } from '../Entity/FavoriEntity';
import { NotFoundError, ValidationError } from '../errors/AppErrors';

export class FavoriService {
    constructor(private readonly favoriRepository: IFavoriRepository) {}

    async getFavoris(userId: string): Promise<FavoriWithMoto[]> {
        return this.favoriRepository.findAllByUser(userId);
    }

    async addFavori(userId: string, motoId: string): Promise<void> {
        const already = await this.favoriRepository.exists(userId, motoId);
        if (already) {
            throw new ValidationError('déjà en favori');
        }
        await this.favoriRepository.create(userId, motoId);
    }

    async removeFavori(userId: string, motoId: string): Promise<void> {
        const exists = await this.favoriRepository.exists(userId, motoId);
        if (!exists) {
            throw new NotFoundError('introuvable');
        }
        await this.favoriRepository.delete(userId, motoId);
    }
}