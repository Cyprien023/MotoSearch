import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized', message: 'Token manquant' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET!;
        const payload = jwt.verify(token, secret) as { userId: string; email: string };
        req.userId = payload.userId;
        req.userEmail = payload.email;
        next();
    } catch {
        res.status(401).json({ error: 'Unauthorized', message: 'Token invalide' });
    }
}