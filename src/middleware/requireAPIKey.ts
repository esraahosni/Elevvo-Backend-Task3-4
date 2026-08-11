import { Request, Response, NextFunction } from 'express';

export const requireAPIKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.header('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });  // من غير return قبلها
        return;                                                                        // return لوحدها من غير قيمة
    }
    next();
};