import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { redisClient } from '../lib/redis';

export const getAllProducts = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `products:page:${page}:limit:${limit}`;

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const products = await prisma.product.findMany({
            skip,
            take: limit,
        });

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));

        return res.status(200).json(products);
    }catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newProduct = await prisma.product.create({
            data: { name, description, price, category, stock },
        });
        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: Number(id) },
        });
        const keys = await redisClient.keys('products:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, description, price, category, stock },
        });
        const keys = await redisClient.keys('products:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
    