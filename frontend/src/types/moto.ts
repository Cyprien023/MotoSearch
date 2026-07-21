export type MotoType =
    | 'Roadster'
    | 'Trail'
    | 'Sportive'
    | 'Custom'
    | 'Scooter'
    | 'Supermotard'
    | 'Trail routier';

export interface Moto {
    id: string;
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    prix: number;
    cylindree: number;
    puissance: number;
    type: MotoType;
    localisation: string;
    region: string;
    vendeur: string;
    datePublication: string;
    photoUrl: string;
    distanceKm: number;
    compatibleA2: boolean;
    score: number;
}

export interface MotoFilters {
    minPrice?: number;
    maxPrice?: number;
    marque?: string;
    modele?: string;
    type?: MotoType;
    cylindree?: number;
    maxKilometrage?: number;
    minYear?: number;
    maxPuissance?: number;
    permisA2?: boolean;
    region?: string;
}

export type SortField = 'prix' | 'kilometrage' | 'annee' | 'puissance' | 'datePublication' | 'distance' | 'score';
export type SortOrder = 'asc' | 'desc';