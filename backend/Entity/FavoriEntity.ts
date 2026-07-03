import { Moto } from './MotoEntity';

export interface Favori {
    id: string;
    userId: string;
    motoId: string;
    createdAt: string;
}

export interface FavoriWithMoto extends Favori {
    moto: Moto;
}