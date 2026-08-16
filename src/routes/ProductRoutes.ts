import { Router } from 'express';
import { deleteProduct, updateProduct, createProduct, getProductById, getAllProducts } from '../controllers/ProductController';
import { authorizeRole } from '../middleware/authorizeRole';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, authorizeRole('ADMIN'), createProduct);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteProduct);

export default router;