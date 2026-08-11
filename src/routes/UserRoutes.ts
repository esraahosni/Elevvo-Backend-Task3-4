import { Router } from 'express';
import { requireAPIKey } from '../middleware/requireAPIKey';
import { getAllUsers, getUserProfile, createUser, updateUser, deleteUser } from '../controllers/UserController';

const router = Router();
router.use(requireAPIKey); 
router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;