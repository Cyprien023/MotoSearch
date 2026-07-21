import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { IMotoRepository } from './Repository/IMotoRepository';
import { MockMotoRepository } from './Repository/MockMotoRepository';
import { MotoRepository } from './Repository/MotoRepository';
import { UserRepository } from './Repository/UserRepository';
import { FavoriRepository } from './Repository/FavoriRepository';
import { MotoService } from './Service/MotoService';
import { AuthService } from './Service/AuthService';
import { FavoriService } from './Service/FavoriService';
import { MotoController } from './Controller/MotoController';
import { AuthController } from './Controller/AuthController';
import { FavoriController } from './Controller/FavoriController';

function createRepository(prisma: PrismaClient): IMotoRepository {
    if (process.env.DATA_SOURCE === 'db') {
        return new MotoRepository(prisma);
    }
    return new MockMotoRepository();
}

export function createApp(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, 'img')));

    const prisma = new PrismaClient();

    const motoRepository = createRepository(prisma);
    const userRepository = new UserRepository(prisma);
    const favoriRepository = new FavoriRepository(prisma);

    const motoService = new MotoService(motoRepository);
    const authService = new AuthService(userRepository);
    const favoriService = new FavoriService(favoriRepository);

    const motoController = new MotoController(motoService);
    const authController = new AuthController(authService);
    const favoriController = new FavoriController(favoriService);

    app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
    app.use('/api/motos', motoController.router);
    app.use('/api/auth', authController.router);
    app.use('/api/favoris', favoriController.router);

    return app;
}