import { Router } from 'express';
import { isAuthenticated } from '#/middleware/authMiddleware.js';
import { deleteUser, update, findAll, create, findSingle } from '#/controllers/user.controller.js';

const router = Router();

// isAuthenticated applied globally in index.js for /book
router.post('/', isAuthenticated, create);
router.get('/', isAuthenticated, findAll);
router.get('/:id', isAuthenticated, findSingle);
router.patch('/:id', isAuthenticated, update);   // new
router.delete('/:id', isAuthenticated, deleteUser);


export default router;
