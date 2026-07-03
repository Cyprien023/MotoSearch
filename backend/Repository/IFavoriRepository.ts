import { FavoriWithMoto } from '../Entity/FavoriEntity';

export interface IFavoriRepository {
    findAllByUser(userId: string): Promise<FavoriWithMoto[]>;
    exists(userId: string, motoId: string): Promise<boolean>;
    create(userId: string, motoId: string): Promise<void>;
    delete(userId: string, motoId: string): Promise<void>;
}