import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../Repository/IUserRepository';
import { UserPublic } from '../Entity/UserEntity';
import { ValidationError } from '../errors/AppErrors';

const SALT_ROUNDS = 10;

export class AuthService {
    constructor(private readonly userRepository: IUserRepository) {}

    async register(email: string, password: string): Promise<UserPublic> {
        if (!email || !password) {
            throw new ValidationError('email et mot de passe requis');
        }

        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new ValidationError('email déjà existant');
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await this.userRepository.create(email, hashed);

        return { id: user.id, email: user.email, createdAt: user.createdAt };
    }

    async login(email: string, password: string): Promise<{ token: string; user: UserPublic }> {
        if (!email || !password) {
            throw new ValidationError('email et mot de passe requis');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new ValidationError('email ou mot de passe incorrect');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new ValidationError('email ou mot de passe incorrect');
        }

        const secret = process.env.JWT_SECRET!;
        const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });

        return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
    }
}