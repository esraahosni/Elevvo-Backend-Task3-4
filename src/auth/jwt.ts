import { User } from '../types/User';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export const generateToken = (user: User): string => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    
    const options = {
        expiresIn: 3600
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
}
export const verifyToken = (token: string): TokenPayload => {
    if (!token) {
        throw new Error('Token is required');
    }
    
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, secretKey);
    return decoded as TokenPayload;
};
