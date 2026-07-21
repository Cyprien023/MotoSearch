import { Router, Request, Response, NextFunction } from 'express';
import { MotoService } from '../Service/MotoService';
import { MotoFilters, MotoSort, MotoSortField, SortOrder } from '../Filter/MotoFilter';
import { MotoType } from '../Entity/MotoEntity';

const VALID_SORT_FIELDS: MotoSortField[] = [
    'prix', 'kilometrage', 'annee', 'puissance', 'datePublication', 'distance', 'score',
];

const VALID_TYPES: MotoType[] = [
    'Roadster', 'Trail', 'Sportive', 'Custom', 'Trail routier',
];

export class MotoController {
    public readonly router: Router;

    constructor(private readonly motoService: MotoService) {
        this.router = Router();
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getById);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const q = req.query as Record<string, string>;

            const filters: MotoFilters = {
                minPrice:       q.minPrice       ? Number(q.minPrice)       : undefined,
                maxPrice:       q.maxPrice       ? Number(q.maxPrice)       : undefined,
                marque:         q.marque         ? q.marque                 : undefined,
                modele:         q.modele         ? q.modele                 : undefined,
                type:           VALID_TYPES.includes(q.type as MotoType) ? q.type as MotoType : undefined,
                cylindree:      q.cylindree      ? Number(q.cylindree)      : undefined,
                maxKilometrage: q.maxKilometrage ? Number(q.maxKilometrage) : undefined,
                minYear:        q.minYear        ? Number(q.minYear)        : undefined,
                maxPuissance:   q.maxPuissance   ? Number(q.maxPuissance)   : undefined,
                permisA2:       q.permisA2 === 'true' ? true : q.permisA2 === 'false' ? false : undefined,
                region:         q.region         ? q.region                 : undefined,
            };

            const sort: MotoSort | undefined = VALID_SORT_FIELDS.includes(q.sortBy as MotoSortField)
                ? { field: q.sortBy as MotoSortField, order: (q.order === 'asc' ? 'asc' : 'desc') as SortOrder }
                : undefined;

            const motos = await this.motoService.getMoto(filters, sort);

            res.status(200).json({ count: motos.length, results: motos });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const moto = await this.motoService.getMotoById(req.params.id);
            res.status(200).json(moto);
        } catch (error) {
            next(error);
        }
    };
}