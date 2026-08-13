import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (requiredRole: 'USER' | 'ADMIN'): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        if (user.role !== requiredRole) {
            res.status(403).json({ message: 'User not authorized' });
            return;
        }
        next();
    };
};