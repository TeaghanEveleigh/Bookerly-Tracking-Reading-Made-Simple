import { Router } from 'express';
import { create, deleteBook, findAll, findSingle, update } from '#/controllers/book.controller.js';
import { isAuthenticated } from '#/middleware/authMiddleware.js';

const router = Router();

router.post('/', isAuthenticated, create);
router.get('/', isAuthenticated, findAll);
router.get('/:id', isAuthenticated, findSingle);
router.patch('/:id', isAuthenticated, update);
router.delete('/:id', isAuthenticated, deleteBook);

export default router;
