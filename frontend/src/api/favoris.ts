import api from './axios';
import { Moto } from '../types/moto';

interface FavoriWithMoto {
    id: string;
    motoId: string;
    moto: Moto;
}

interface FavorisResponse {
    count: number;
    results: FavoriWithMoto[];
}

export async function fetchFavoris(): Promise<FavorisResponse> {
    const res = await api.get<FavorisResponse>('/favoris');
    return res.data;
}

export async function addFavori(motoId: string): Promise<void> {
    await api.post(`/favoris/${motoId}`);
}

export async function removeFavori(motoId: string): Promise<void> {
    await api.delete(`/favoris/${motoId}`);
}