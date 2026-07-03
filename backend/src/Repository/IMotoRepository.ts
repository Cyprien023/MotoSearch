import { Moto } from '../Entity/MotoEntity';

export interface IMotoRepository {
    findAll(): Promise<Moto[]>;
    findById(id: string): Promise<Moto | null>;
}