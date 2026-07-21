import { IMotoRepository } from '../Repository/IMotoRepository';
import { Moto, MotoWithRules } from '../Entity/MotoEntity';
import { NotFoundError } from '../errors/AppErrors';
import {
    DEFAULT_SORT,
    MotoFilters,
    MotoSort,
} from '../Filter/MotoFilter';

const PERMIS_A2_MAX_PUISSANCE_KW = 35;

export class MotoService {
    constructor(private readonly repository: IMotoRepository) {}

    async getMoto(filters: MotoFilters = {}, sort?: MotoSort): Promise<MotoWithRules[]> {
        const all = await this.repository.findAll();
        const enriched = all.map((moto) => this.enrichWithRules(moto, filters));

        const normalizedFilters = this.normalizeFilters(filters);
        const filtered = enriched.filter((moto) => this.matchesFilters(moto, normalizedFilters));

        return this.sort(filtered, sort ?? DEFAULT_SORT);
    }

    async getMotoById(id: string): Promise<MotoWithRules> {
        const moto = await this.repository.findById(id);
        if (!moto) {
            throw new NotFoundError(`Aucune moto trouvée id "${id}"`);
        }
        return this.enrichWithRules(moto);
    }

    private isCompatibleA2(moto: Moto): boolean {
        return moto.puissance <= PERMIS_A2_MAX_PUISSANCE_KW;
    }

    private enrichWithRules(moto: Moto, filters: MotoFilters = {}): MotoWithRules {
        return {
            ...moto,
            compatibleA2: this.isCompatibleA2(moto),
            score: this.computeScore({ ...moto, compatibleA2: this.isCompatibleA2(moto), score: 0 }, filters),
        };
    }

    /* tolère des filtres min/max inversés côté client en les remettant dans le bon ordre plutôt que de renvoyer une liste vide. */
    private normalizeFilters(filters: MotoFilters): MotoFilters {
        const normalized = { ...filters };

        if (
            normalized.minPrice !== undefined &&
            normalized.maxPrice !== undefined &&
            normalized.minPrice > normalized.maxPrice
        ) {
            [normalized.minPrice, normalized.maxPrice] = [normalized.maxPrice, normalized.minPrice];
        }

        return normalized;
    }

    /* tous les filtres en ET logique. */
    private matchesFilters(moto: MotoWithRules, filters: MotoFilters): boolean {
        if (filters.minPrice !== undefined && moto.prix < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && moto.prix > filters.maxPrice) return false;
        if (filters.marque && !this.matchesText(moto.marque, filters.marque)) return false;
        if (filters.modele && !this.matchesText(moto.modele, filters.modele)) return false;
        if (filters.type && moto.type !== filters.type) return false;
        if (filters.cylindree !== undefined && moto.cylindree !== filters.cylindree) return false;
        if (filters.maxKilometrage !== undefined && moto.kilometrage > filters.maxKilometrage) return false;
        if (filters.minYear !== undefined && moto.annee < filters.minYear) return false;
        if (filters.maxPuissance !== undefined && moto.puissance > filters.maxPuissance) return false;
        if (filters.permisA2 !== undefined && moto.compatibleA2 !== filters.permisA2) return false;
        if (filters.region && !this.matchesText(moto.region, filters.region)) return false;

        return true;
    }

    /* Sortir dans un helper */
    private matchesText(value: string, query: string): boolean {
        return value.toLowerCase().includes(query.toLowerCase());
    }

    /* tri par défaut sur la date de publication */
    private sort(motos: MotoWithRules[], sort: MotoSort): MotoWithRules[] {
        const direction = sort.order === 'asc' ? 1 : -1;

        const getComparableValue = (moto: MotoWithRules): number => {
            switch (sort.field) {
                case 'prix':
                    return moto.prix;
                case 'kilometrage':
                    return moto.kilometrage;
                case 'annee':
                    return moto.annee;
                case 'puissance':
                    return moto.puissance;
                case 'distance':
                    return moto.distanceKm;
                case 'datePublication':
                default:
                    return new Date(moto.datePublication).getTime();
                case 'score':
                    return moto.score;
            }
        };

        return [...motos].sort((a, b) => (getComparableValue(a) - getComparableValue(b)) * direction);
    }

    private computeScore(moto: MotoWithRules, filters: MotoFilters): number {
        let score = 0;

        // correspondance de marque
        if (filters.marque && moto.marque.toLowerCase() === filters.marque.toLowerCase()) score += 5;

        // correspondance de type
        if (filters.type && moto.type === filters.type) score += 4;

        // même région
        if (filters.region && moto.region.toLowerCase().includes(filters.region.toLowerCase())) score += 3;

        // dans la fourchette de prix
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            const milieu = (filters.minPrice + filters.maxPrice) / 2;
            const ecart = Math.abs(moto.prix - milieu);
            const fourchette = (filters.maxPrice - filters.minPrice) / 2;
            if (ecart < fourchette * 0.25) score += 3;
            else if (ecart < fourchette * 0.5) score += 2;
            else score += 1;
        }

        // kilométrage faible
        if (moto.kilometrage < 5000) score += 3;
        else if (moto.kilometrage < 15000) score += 2;
        else if (moto.kilometrage < 30000) score += 1;

        // annonce récente
        const joursDepuisPublication = (Date.now() - new Date(moto.datePublication).getTime()) / (1000 * 60 * 60 * 24);
        if (joursDepuisPublication < 7) score += 3;
        else if (joursDepuisPublication < 30) score += 2;
        else if (joursDepuisPublication < 90) score += 1;

        // compatible A2 si filtre actif
        if (filters.permisA2 && moto.compatibleA2) score += 2;

        return score;
    }
}