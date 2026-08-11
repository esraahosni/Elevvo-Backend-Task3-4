import { Request, Response } from 'express';
import { userService } from '../services/UserServices';
export const getAllUsers = (_req: Request, res: Response) => {
    const users = userService.getAll();  
    res.status(200).json(users);   
};
export const getUserProfile = (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = userService.getById(userId);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};
export const createUser = (req: Request, res: Response) => {
    const { name, email, status } = req.body;
    if (!name || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const newUser = userService.create({ 
        name, 
        email, 
        status: status || 'Active' 
    });
    res.status(201).json(newUser);
};
export const updateUser = (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const { name, email, status } = req.body;
    const updatedUser = userService.update(userId, { name, email, status });
    if (updatedUser) {
        res.status(200).json(updatedUser);
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