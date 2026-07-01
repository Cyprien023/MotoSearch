import { Router, Request, Response, NextFunction } from 'express';
import { MotoService } from '../Service/MotoService';

export class MotoController {
    public readonly router: Router;

    constructor(private readonly motoService: MotoService) {
        this.router = Router();

        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getById);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const motos = await this.motoService.getMoto();

            res.status(200).json({
                count: motos.length,
                results: motos,
            });
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