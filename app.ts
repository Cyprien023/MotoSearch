import express, { Express } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { IMotoRepository } from './Repository/IMotoRepository';
import { MockMotoRepository } from './Repository/MockMotoRepository';
import { MotoRepository } from './Repository/MotoRepository';
import { MotoService } from './Service/MotoService';
import { MotoController } from './Controller/MotoController';


function createRepository(): IMotoRepository {
    if (process.env.DATA_SOURCE === 'db') {
        const prisma = new PrismaClient();
        return new MotoRepository(prisma);
    }
    return new MockMotoRepository();
}

export function createApp(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const repository = createRepository();
    const motoService = new MotoService();
    const motoController = new MotoController(motoService);

    app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
    app.use('/api/motos', motoController.router);


    return app;
}