export type MotoType = | 'Roadster' | 'Trail' | 'Sportive' | 'Custom' | 'Trail routier';

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
}

export interface MotoWithRules extends Moto {
    compatibleA2: boolean;
    score: number;
}