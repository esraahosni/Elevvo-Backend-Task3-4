import { Request, Response } from 'express';
import { userService } from '../services/UserServices';
import { hashPassword } from '../auth/password';    
export const getAllUsers = (_req: Request, res: Response) => {
    const users = userService.getAll();   
    const usersWithoutPasswords = users.map(user => {   
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });  
    res.status(200).json(usersWithoutPasswords);   
};
export const getUserProfile = (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = userService.getById(userId);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};
export const createUser = async (req: Request, res: Response) => {
    const { name, email, status, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const hashedPassword = await hashPassword(password);
    const newUser = userService.create({
        name,
        email,
        status: status || 'Active',
        password: hashedPassword,
        role: 'USER'
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
};

export const updateUser = (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const { name, email, status } = req.body;
    const updatedUser = userService.update(userId, { name, email, status });
    if (updatedUser) {
        const { password: _ , ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

export const deleteUser = (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const deleted = userService.delete(userId);
    if (deleted) {
        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};