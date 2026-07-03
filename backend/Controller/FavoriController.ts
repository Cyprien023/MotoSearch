import { Response, NextFunction, Router } from 'express';
import { FavoriService } from '../Service/FavoriService';
import { authenticateJWT, AuthRequest } from '../Middleware/AuthenticateJWT';

export class FavoriController {
    public readonly router: Router;

    constructor(private readonly favoriService: FavoriService) {
        this.router = Router();
        this.router.use(authenticateJWT);
        this.router.get('/', this.getAll);
        this.router.post('/:motoId', this.add);
        this.router.delete('/:motoId', this.remove);
    }

    getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const favoris = await this.favoriService.getFavoris(req.userId!);
            res.status(200).json({ count: favoris.length, results: favoris });
        } catch (error) {
            next(error);
        }
    };

    add = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.favoriService.addFavori(req.userId!, req.params.motoId);
            res.status(201).json({ message: 'Moto ajoutée aux favoris.' });
        } catch (error) {
            next(error);
        }
    };

    remove = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.favoriService.removeFavori(req.userId!, req.params.motoId);
            res.status(200).json({ message: 'Favori supprimé.' });
        } catch (error) {
            next(error);
        }
    };
}