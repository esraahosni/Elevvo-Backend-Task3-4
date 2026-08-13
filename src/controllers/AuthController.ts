import { Request, Response } from 'express';
import { userService } from '../services/UserServices';
import { comparePassword } from '../auth/password';
import { generateToken } from '../auth/jwt';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = userService.getByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};    