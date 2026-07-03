import { User } from '../Entity/UserEntity';

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    create(email: string, hashedPassword: string): Promise<User>;
}