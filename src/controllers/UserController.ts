import { Request, Response } from 'express';
import { hashPassword } from '../auth/password';    
import { prisma } from '../lib/prisma';

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });  
    res.status(200).json(usersWithoutPasswords);   
};

export const getUserProfile = async (req: Request, res: Response) => {
    const userIdParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = Number(userIdParam);
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
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
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            status: status || 'ACTIVE',
            password: hashedPassword,
            role: 'USER'
        }
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
};

export const updateUser = async (req: Request, res: Response) => {
    const userIdParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = Number(userIdParam);
    const { name, email, status } = req.body;
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email, status }
    });
    if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userIdParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = Number(userIdParam);
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};