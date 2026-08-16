import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createOrder = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { items } = req.body;

    const hasInvalidItem = items.some(
        (item: { productId: number; quantity: number }) => !item.productId || !item.quantity
    );
    if (hasInvalidItem) {
        res.status(400).json({ error: 'Invalid order item' });
        return;
    }

    try {
        const orderItemsData = await Promise.all(
            items.map(async (item: { productId: number; quantity: number }) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: product.price * item.quantity,
                };
            })
        );

        const total = orderItemsData.reduce((sum, item) => sum + item.subtotal, 0);

        const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: { userId: userId, total: total },
        });

        await tx.orderItem.createMany({
            data: orderItemsData.map((item) => ({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
            })),
        });

        await Promise.all(
            orderItemsData.map(async (item) => {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            })
        );
        return newOrder;
});

        res.status(201).json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    
};

export const getOrders = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const totalAmountSpent = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    try {
        const totalSpent = await prisma.order.aggregate({
            where: { userId },
            _sum: {
                total: true,
            },
        });
        res.status(200).json({ totalSpent: totalSpent._sum.total || 0 });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};