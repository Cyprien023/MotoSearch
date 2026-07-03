import api from './axios';
import { Moto, MotoFilters, SortField, SortOrder } from '../types/moto';

interface MotosResponse {
    count: number;
    results: Moto[];
}

export async function fetchMotos(
    filters: MotoFilters = {},
    sortBy?: SortField,
    order?: SortOrder
): Promise<MotosResponse> {
    const params: Record<string, string> = {};

    if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
    if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
    if (filters.marque) params.marque = filters.marque;
    if (filters.modele) params.modele = filters.modele;
    if (filters.type) params.type = filters.type;
    if (filters.cylindree !== undefined) params.cylindree = String(filters.cylindree);
    if (filters.maxKilometrage !== undefined) params.maxKilometrage = String(filters.maxKilometrage);
    if (filters.minYear !== undefined) params.minYear = String(filters.minYear);
    if (filters.maxPuissance !== undefined) params.maxPuissance = String(filters.maxPuissance);
    if (filters.permisA2 !== undefined) params.permisA2 = String(filters.permisA2);
    if (filters.region) params.region = filters.region;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;

    const res = await api.get<MotosResponse>('/motos', { params });
    return res.data;
}

export async function fetchMotoById(id: string): Promise<Moto> {
    const res = await api.get<Moto>(`/motos/${id}`);
    return res.data;
}