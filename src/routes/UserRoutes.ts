import { Router } from 'express';
import { getAllUsers, getUserProfile, createUser, updateUser, deleteUser } from '../controllers/UserController';
import { authenticateToken } from '../middleware/authenticateToken';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();
router.get('/',authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserProfile);
router.post('/', createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id',authenticateToken, authorizeRole('ADMIN'), deleteUser);

export default router;