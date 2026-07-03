import { MotoType } from '../Entity/MotoEntity';

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

export type MotoSortField = | 'prix' | 'kilometrage' | 'annee' | 'puissance' | 'datePublication' | 'distance';

export type SortOrder = 'asc' | 'desc';

export interface MotoSort {
    field: MotoSortField;
    order: SortOrder;
}

export const DEFAULT_SORT: MotoSort = { field: 'datePublication', order: 'desc' };