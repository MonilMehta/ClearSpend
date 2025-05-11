import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string | Types.ObjectId;
            };
        }
    }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement proper authentication
    // For now, we'll use a mock user for development
    req.user = {
        id: new Types.ObjectId('000000000000000000000000') // Mock user ID
    };
    next();
}; 