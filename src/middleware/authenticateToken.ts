import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
}
};