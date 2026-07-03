import { Request, Response, NextFunction, Router } from 'express';
import { AuthService } from '../Service/AuthService';

export class AuthController {
    public readonly router: Router;

    constructor(private readonly authService: AuthService) {
        this.router = Router();
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await this.authService.register(email, password);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}