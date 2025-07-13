import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement proper authentication
    // For now, we'll use a mock user for development
    req.user = {
        id: 'mock-user-id-12345' // Mock user ID (string format for Prisma)
    };
    next();
}; 