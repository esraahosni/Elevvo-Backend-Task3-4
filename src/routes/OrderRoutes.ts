import { Router } from 'express';
import { createOrder, getOrders, totalAmountSpent } from '../controllers/OrderController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getOrders);
router.get('/total', authenticateToken, totalAmountSpent);

export default router;