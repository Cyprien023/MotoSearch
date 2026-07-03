import { IMotoRepository } from './IMotoRepository';
import { Moto } from '../Entity/MotoEntity';
import { mockMoto } from '../Data/MockMoto';


export class MockMotoRepository implements IMotoRepository {
    private readonly motos: Moto[] = mockMoto;

    async findAll(): Promise<Moto[]> {
        return this.motos;
    }

    async findById(id: string): Promise<Moto | null> {
        return this.motos.find((m) => m.id === id) ?? null;
    }
}